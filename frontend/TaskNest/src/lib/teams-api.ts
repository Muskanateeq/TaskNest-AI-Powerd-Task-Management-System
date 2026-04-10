/**
 * Teams API Client
 *
 * Handles all team-related API requests
 */

import { api } from './api';
import { Team, TeamCreateRequest, TeamUpdateRequest } from './types';

/**
 * Create a new team
 */
export async function createTeam(data: TeamCreateRequest): Promise<Team> {
  return api.post<Team>('/teams', data);
}

/**
 * Get all teams for current user
 */
export async function getUserTeams(): Promise<Team[]> {
  return api.get<Team[]>('/teams');
}

/**
 * Get team by ID
 */
export async function getTeam(teamId: number): Promise<Team> {
  return api.get<Team>(`/teams/${teamId}`);
}

/**
 * Update team
 */
export async function updateTeam(
  teamId: number,
  data: TeamUpdateRequest
): Promise<Team> {
  return api.put<Team>(`/teams/${teamId}`, data);
}

/**
 * Delete team
 */
export async function deleteTeam(teamId: number): Promise<void> {
  return api.delete<void>(`/teams/${teamId}`);
}

/**
 * Get team members
 */
export async function getTeamMembers(teamId: number): Promise<unknown[]> {
  return api.get<unknown[]>(`/teams/${teamId}/members`);
}

/**
 * Invite member to team
 */
export async function inviteMember(
  teamId: number,
  email: string
): Promise<unknown> {
  return api.post<unknown>(`/teams/${teamId}/invite`, { email });
}
