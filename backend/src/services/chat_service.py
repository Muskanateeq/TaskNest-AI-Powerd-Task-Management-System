"""
Chat Service Layer

Orchestrates AI chat functionality by coordinating:
- LLM provider (Groq/Gemini/OpenAI)
- MCP tools (function calling)
- Conversation persistence
- Message history management
- Streaming responses
"""

import json
import logging
from typing import List, Dict, Any, Optional, AsyncIterator
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from src.llm.provider_manager import ProviderManager
from src.mcp.tools import get_all_tools, execute_tool
from src.services.conversation_service import ConversationService
from src.models.message import MessageCreate

# Configure logging
logger = logging.getLogger(__name__)


class ChatService:
    """Service class for AI chat operations"""

    @staticmethod
    async def send_message_stream(
        user_id: str,
        conversation_id: Optional[int],
        user_message: str,
        session: AsyncSession
    ) -> AsyncIterator[Dict[str, Any]]:
        """
        Process a user message and stream AI response in real-time.

        Yields events:
        - {"type": "conversation_id", "conversation_id": int}
        - {"type": "content", "content": str}
        - {"type": "tool_call", "tool": str, "status": str}
        - {"type": "done", "message_id": int}
        - {"type": "error", "error": str}

        Args:
            user_id: User ID from JWT token
            conversation_id: Optional conversation ID (creates new if None)
            user_message: User's message text
            session: Database session

        Yields:
            Event dictionaries for SSE streaming
        """
        try:
            # Step 1: Get or create conversation
            if conversation_id is None:
                conversation = await ConversationService.create_conversation(user_id, session)
                conversation_id = conversation.id
            else:
                conversation = await ConversationService.get_conversation(
                    conversation_id, user_id, session
                )

            # Yield conversation ID first
            yield {"type": "conversation_id", "conversation_id": conversation_id}

            # Step 2: Save user message
            await ConversationService.add_message(
                conversation_id=conversation_id,
                user_id=user_id,
                message_data=MessageCreate(
                    conversation_id=conversation_id,
                    role="user",
                    content=user_message
                ),
                session=session
            )

            # Step 3: Build message history
            message_history = await ChatService._build_message_history(
                conversation_id, user_id, session
            )

            # Step 4: Get LLM provider and tools
            provider = ProviderManager.get_provider()
            tools = get_all_tools()

            # Step 5: Stream LLM response
            accumulated_content = ""
            tool_calls_data = None

            async for chunk in provider.chat_completion_stream(
                messages=message_history,
                tools=tools
            ):
                # Extract content from chunk
                if chunk.get("choices"):
                    choice = chunk["choices"][0]
                    delta = choice.get("delta", {})

                    # Stream content
                    if delta.get("content"):
                        content = delta["content"]
                        accumulated_content += content
                        yield {"type": "content", "content": content}

                    # Check for tool calls
                    if delta.get("tool_calls"):
                        tool_calls_data = delta["tool_calls"]

            # Step 6: Handle tool calls if present
            tool_results = []
            if tool_calls_data:
                for tool_call in tool_calls_data:
                    function_name = tool_call["function"]["name"]
                    function_args = json.loads(tool_call["function"]["arguments"])

                    # Notify about tool execution
                    yield {
                        "type": "tool_call",
                        "tool": function_name,
                        "status": "executing"
                    }

                    # Execute tool
                    try:
                        result = await execute_tool(
                            tool_name=function_name,
                            arguments=function_args,
                            user_id=user_id,
                            session=session
                        )
                        tool_results.append({
                            "tool": function_name,
                            "arguments": function_args,
                            "result": result
                        })
                        yield {
                            "type": "tool_call",
                            "tool": function_name,
                            "status": "completed"
                        }
                    except Exception as e:
                        logger.error(f"Tool execution failed: {e}")
                        yield {
                            "type": "tool_call",
                            "tool": function_name,
                            "status": "failed",
                            "error": str(e)
                        }

                # If tools were executed, get final response
                if tool_results:
                    message_history.append({
                        "role": "assistant",
                        "content": accumulated_content or "",
                        "tool_calls": tool_calls_data
                    })

                    for tool_result in tool_results:
                        message_history.append({
                            "role": "function",
                            "name": tool_result["tool"],
                            "content": json.dumps(tool_result.get("result"))
                        })

                    # Stream final response
                    accumulated_content = ""
                    async for chunk in provider.chat_completion_stream(
                        messages=message_history,
                        tools=tools
                    ):
                        if chunk.get("choices"):
                            choice = chunk["choices"][0]
                            delta = choice.get("delta", {})
                            if delta.get("content"):
                                content = delta["content"]
                                accumulated_content += content
                                yield {"type": "content", "content": content}

            # Step 7: Save assistant response
            final_content = accumulated_content or "I've completed the requested action."
            assistant_msg = await ConversationService.add_message(
                conversation_id=conversation_id,
                user_id=user_id,
                message_data=MessageCreate(
                    conversation_id=conversation_id,
                    role="assistant",
                    content=final_content
                ),
                session=session
            )

            # Step 8: Send done event
            yield {
                "type": "done",
                "message_id": assistant_msg.id,
                "tool_calls": tool_results if tool_results else None
            }

        except Exception as e:
            logger.error(f"[ChatService] Streaming error: {e}", exc_info=True)
            yield {"type": "error", "error": str(e)}

    @staticmethod
    async def send_message(
        user_id: str,
        conversation_id: Optional[int],
        user_message: str,
        session: AsyncSession
    ) -> Dict[str, Any]:
        """
        Process a user message and generate AI response.

        This method:
        1. Creates/retrieves conversation
        2. Saves user message
        3. Builds message history
        4. Calls LLM with tools
        5. Executes tool calls if needed
        6. Saves assistant response
        7. Returns complete response

        Args:
            user_id: User ID from JWT token
            conversation_id: Optional conversation ID (creates new if None)
            user_message: User's message text
            session: Database session

        Returns:
            {
                "conversation_id": int,
                "message": str,  # Assistant's response
                "tool_calls": [...],  # Optional tool executions
                "created_at": datetime
            }

        Raises:
            HTTPException: If conversation not found or access denied
        """
        # Step 1: Get or create conversation
        if conversation_id is None:
            conversation = await ConversationService.create_conversation(user_id, session)
            conversation_id = conversation.id
        else:
            # Verify conversation exists and belongs to user
            conversation = await ConversationService.get_conversation(
                conversation_id, user_id, session
            )

        # Step 2: Save user message
        user_msg = await ConversationService.add_message(
            conversation_id=conversation_id,
            user_id=user_id,
            message_data=MessageCreate(
                conversation_id=conversation_id,
                role="user",
                content=user_message
            ),
            session=session
        )

        # Step 3: Build message history for LLM
        message_history = await ChatService._build_message_history(
            conversation_id, user_id, session
        )

        # Step 4: Get LLM provider and tools
        provider = ProviderManager.get_provider()
        tools = get_all_tools()

        # Step 5: Call LLM
        try:
            logger.info(f"[ChatService] Calling LLM with {len(message_history)} messages and {len(tools)} tools")
            llm_response = await provider.chat_completion(
                messages=message_history,
                tools=tools,
                stream=False
            )
            logger.info(f"[ChatService] LLM call successful")
        except Exception as e:
            logger.error(f"[ChatService] LLM call failed: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"LLM call failed: {str(e)}"
            )

        # Step 6: Process response and handle tool calls
        try:
            assistant_message = llm_response["choices"][0]["message"]
        except (KeyError, IndexError) as e:
            logger.error(f"[ChatService] Invalid LLM response format: {e}", exc_info=True)
            logger.error(f"[ChatService] LLM response: {llm_response}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Invalid LLM response format: {str(e)}"
            )
        tool_results = []

        # Check if LLM wants to call tools
        if assistant_message.get("tool_calls"):
            for tool_call in assistant_message["tool_calls"]:
                function_name = tool_call["function"]["name"]
                function_args = json.loads(tool_call["function"]["arguments"])

                # Execute tool
                try:
                    result = await execute_tool(
                        tool_name=function_name,
                        arguments=function_args,
                        user_id=user_id,
                        session=session
                    )
                    tool_results.append({
                        "tool": function_name,
                        "arguments": function_args,
                        "result": result
                    })
                except Exception as e:
                    tool_results.append({
                        "tool": function_name,
                        "arguments": function_args,
                        "error": str(e)
                    })

            # If tools were called, make another LLM call with results
            if tool_results:
                # Add tool results to message history
                message_history.append({
                    "role": "assistant",
                    "content": assistant_message.get("content") or "",
                    "tool_calls": assistant_message.get("tool_calls")
                })

                # Add tool results as separate messages
                for tool_result in tool_results:
                    message_history.append({
                        "role": "function",
                        "name": tool_result["tool"],
                        "content": json.dumps(tool_result.get("result", tool_result.get("error")))
                    })

                # Call LLM again to generate final response
                final_response = await provider.chat_completion(
                    messages=message_history,
                    tools=tools,
                    stream=False
                )
                assistant_message = final_response["choices"][0]["message"]

        # Step 7: Save assistant response
        assistant_content = assistant_message.get("content") or "I've completed the requested action."
        assistant_msg = await ConversationService.add_message(
            conversation_id=conversation_id,
            user_id=user_id,
            message_data=MessageCreate(
                conversation_id=conversation_id,
                role="assistant",
                content=assistant_content
            ),
            session=session
        )

        # Step 8: Return response
        return {
            "conversation_id": conversation_id,
            "message": assistant_content,
            "tool_calls": tool_results if tool_results else None,
            "created_at": assistant_msg.created_at
        }

    @staticmethod
    async def _build_message_history(
        conversation_id: int,
        user_id: str,
        session: AsyncSession,
        max_messages: int = 20
    ) -> List[Dict[str, str]]:
        """
        Build message history for LLM context.

        Args:
            conversation_id: Conversation ID
            user_id: User ID from JWT token
            session: Database session
            max_messages: Maximum number of messages to include

        Returns:
            List of messages in OpenAI format with system prompt
        """
        # Get recent messages
        message_list = await ConversationService.get_conversation_messages(
            conversation_id=conversation_id,
            user_id=user_id,
            session=session,
            limit=max_messages,
            offset=0
        )

        # Build message history
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a helpful AI assistant for TaskNest, a task management application. "
                    "You can help users create, view, update, complete, and delete tasks using natural language. "
                    "When users ask about their tasks, use the list_tasks tool. "
                    "When users want to add a task, use the create_task tool. "
                    "When users want to mark a task as done, use the complete_task tool. "
                    "When users want to modify a task, use the update_task tool. "
                    "When users want to remove a task, use the delete_task tool. "
                    "Be conversational, friendly, and helpful. "
                    "Always confirm actions after executing them."
                )
            }
        ]

        # Add conversation messages
        for msg in message_list.messages:
            messages.append({
                "role": msg.role,
                "content": msg.content
            })

        return messages

    @staticmethod
    async def get_conversation_history(
        conversation_id: int,
        user_id: str,
        session: AsyncSession,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        Get conversation history with messages.

        Args:
            conversation_id: Conversation ID
            user_id: User ID from JWT token
            session: Database session
            limit: Maximum number of messages to return
            offset: Number of messages to skip

        Returns:
            {
                "conversation": ConversationPublic,
                "messages": [MessagePublic, ...],
                "total": int,
                "has_more": bool
            }
        """
        # Get conversation
        conversation = await ConversationService.get_conversation(
            conversation_id, user_id, session
        )

        # Get messages
        message_list = await ConversationService.get_conversation_messages(
            conversation_id, user_id, session, limit, offset
        )

        return {
            "conversation": conversation,
            "messages": message_list.messages,
            "total": message_list.total,
            "has_more": message_list.has_more
        }

    @staticmethod
    async def list_conversations(
        user_id: str,
        session: AsyncSession,
        limit: int = 50,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        List all conversations for a user.

        Args:
            user_id: User ID from JWT token
            session: Database session
            limit: Maximum number of conversations to return
            offset: Number of conversations to skip

        Returns:
            {
                "conversations": [ConversationPublic, ...],
                "total": int
            }
        """
        conversation_list = await ConversationService.get_user_conversations(
            user_id, session, limit, offset
        )

        return {
            "conversations": conversation_list.conversations,
            "total": conversation_list.total
        }

    @staticmethod
    async def delete_conversation(
        conversation_id: int,
        user_id: str,
        session: AsyncSession
    ) -> None:
        """
        Delete a conversation.

        Args:
            conversation_id: Conversation ID
            user_id: User ID from JWT token
            session: Database session
        """
        await ConversationService.delete_conversation(
            conversation_id, user_id, session
        )
