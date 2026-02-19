"""
MCP Tools for Task Management

These tools wrap the existing TaskService methods and expose them
to the LLM for function calling via the Model Context Protocol.
"""

from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession

from src.services.task_service import TaskService
from src.models.task import TaskCreate, TaskUpdate, TaskCompletionToggle


# Tool 1: Create Task
create_task_tool = {
    "type": "function",
    "function": {
        "name": "create_task",
        "description": "Create a new task for the user. Use this when the user wants to add a task, todo, or reminder.",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The task title or description"
                },
                "description": {
                    "type": "string",
                    "description": "Optional detailed description of the task"
                },
                "priority": {
                    "type": "string",
                    "enum": ["low", "medium", "high"],
                    "description": "Task priority level (default: medium)"
                },
                "due_date": {
                    "type": "string",
                    "description": "Optional due date in YYYY-MM-DD format"
                },
                "due_time": {
                    "type": "string",
                    "description": "Optional due time in HH:MM format (24-hour)"
                },
                "recurrence_pattern": {
                    "type": "string",
                    "enum": ["daily", "weekly", "monthly"],
                    "description": "Optional recurrence pattern for recurring tasks"
                },
                "tag_ids": {
                    "type": "array",
                    "items": {"type": "integer"},
                    "description": "Optional list of tag IDs to associate with the task"
                }
            },
            "required": ["title"]
        }
    }
}


# Tool 2: List Tasks
list_tasks_tool = {
    "type": "function",
    "function": {
        "name": "list_tasks",
        "description": "Get a list of the user's tasks. Use this when the user wants to see their tasks, todos, or check what they need to do.",
        "parameters": {
            "type": "object",
            "properties": {
                "search": {
                    "type": "string",
                    "description": "Optional search query to filter tasks by title or description"
                },
                "status": {
                    "type": "string",
                    "enum": ["all", "active", "completed"],
                    "description": "Filter by completion status (default: all)"
                },
                "priority": {
                    "type": "string",
                    "enum": ["low", "medium", "high"],
                    "description": "Filter by priority level"
                },
                "sort_by": {
                    "type": "string",
                    "enum": ["created_at", "due_date", "priority", "title"],
                    "description": "Sort field (default: created_at)"
                },
                "sort_order": {
                    "type": "string",
                    "enum": ["asc", "desc"],
                    "description": "Sort order (default: desc)"
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of tasks to return (default: 50)"
                }
            },
            "required": []
        }
    }
}


# Tool 3: Update Task
update_task_tool = {
    "type": "function",
    "function": {
        "name": "update_task",
        "description": "Update an existing task. Use this when the user wants to modify a task's details.",
        "parameters": {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "integer",
                    "description": "The ID of the task to update"
                },
                "title": {
                    "type": "string",
                    "description": "New task title"
                },
                "description": {
                    "type": "string",
                    "description": "New task description"
                },
                "priority": {
                    "type": "string",
                    "enum": ["low", "medium", "high"],
                    "description": "New priority level"
                },
                "due_date": {
                    "type": "string",
                    "description": "New due date in YYYY-MM-DD format"
                },
                "due_time": {
                    "type": "string",
                    "description": "New due time in HH:MM format (24-hour)"
                },
                "recurrence_pattern": {
                    "type": "string",
                    "enum": ["daily", "weekly", "monthly"],
                    "description": "New recurrence pattern"
                }
            },
            "required": ["task_id"]
        }
    }
}


# Tool 4: Complete Task
complete_task_tool = {
    "type": "function",
    "function": {
        "name": "complete_task",
        "description": "Mark a task as completed or uncompleted. Use this when the user wants to check off a task or mark it as done.",
        "parameters": {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "integer",
                    "description": "The ID of the task to complete/uncomplete"
                },
                "completed": {
                    "type": "boolean",
                    "description": "True to mark as completed, False to mark as incomplete"
                }
            },
            "required": ["task_id", "completed"]
        }
    }
}


# Tool 5: Delete Task
delete_task_tool = {
    "type": "function",
    "function": {
        "name": "delete_task",
        "description": "Delete a task permanently. Use this when the user wants to remove a task.",
        "parameters": {
            "type": "object",
            "properties": {
                "task_id": {
                    "type": "integer",
                    "description": "The ID of the task to delete"
                }
            },
            "required": ["task_id"]
        }
    }
}


def get_all_tools() -> List[Dict[str, Any]]:
    """
    Get all available MCP tools.

    Returns:
        List of tool definitions in OpenAI function calling format
    """
    return [
        create_task_tool,
        list_tasks_tool,
        update_task_tool,
        complete_task_tool,
        delete_task_tool,
    ]


async def execute_tool(
    tool_name: str,
    arguments: Dict[str, Any],
    user_id: str,
    session: AsyncSession
) -> Dict[str, Any]:
    """
    Execute a tool by name with the given arguments.

    Args:
        tool_name: Name of the tool to execute
        arguments: Tool arguments as a dictionary
        user_id: User ID from JWT token
        session: Database session

    Returns:
        Tool execution result

    Raises:
        ValueError: If tool name is invalid
    """
    if tool_name == "create_task":
        # Create TaskCreate model from arguments
        task_data = TaskCreate(
            title=arguments["title"],
            description=arguments.get("description"),
            priority=arguments.get("priority", "medium"),
            due_date=arguments.get("due_date"),
            due_time=arguments.get("due_time"),
            recurrence_pattern=arguments.get("recurrence_pattern"),
            tag_ids=arguments.get("tag_ids", [])
        )
        result = await TaskService.create_task(user_id, task_data, session)
        return {
            "success": True,
            "task": result.model_dump(mode='json'),
            "message": f"Task '{result.title}' created successfully"
        }

    elif tool_name == "list_tasks":
        # Get tasks with filters
        tasks = await TaskService.get_user_tasks(
            user_id=user_id,
            session=session,
            search=arguments.get("search"),
            status=arguments.get("status", "all"),
            priority=arguments.get("priority"),
            sort_by=arguments.get("sort_by", "created_at"),
            sort_order=arguments.get("sort_order", "desc"),
            limit=arguments.get("limit", 50)
        )
        return {
            "success": True,
            "tasks": [task.model_dump(mode='json') for task in tasks],
            "count": len(tasks),
            "message": f"Found {len(tasks)} task(s)"
        }

    elif tool_name == "update_task":
        # Create TaskUpdate model from arguments
        task_id = arguments.pop("task_id")
        task_data = TaskUpdate(**arguments)
        result = await TaskService.update_task(task_id, user_id, task_data, session)
        return {
            "success": True,
            "task": result.model_dump(mode='json'),
            "message": f"Task '{result.title}' updated successfully"
        }

    elif tool_name == "complete_task":
        # Toggle task completion
        task_id = arguments["task_id"]
        completed = arguments["completed"]
        toggle_data = TaskCompletionToggle(completed=completed)
        result = await TaskService.toggle_task_completion(task_id, user_id, toggle_data, session)
        status = "completed" if completed else "incomplete"
        return {
            "success": True,
            "task": result.model_dump(mode='json'),
            "message": f"Task '{result.title}' marked as {status}"
        }

    elif tool_name == "delete_task":
        # Delete task
        task_id = arguments["task_id"]
        await TaskService.delete_task(task_id, user_id, session)
        return {
            "success": True,
            "message": f"Task deleted successfully"
        }

    else:
        raise ValueError(f"Unknown tool: {tool_name}")
