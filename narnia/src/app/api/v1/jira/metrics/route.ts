import { NextRequest, NextResponse } from "next/server";
import { SERVICE_TYPES, container } from "@/infrastructure/ioc";
import { JiraExternalApiService } from "@/infrastructure/services/JiraExternalApiService";
import { KeycloakService } from "@/infrastructure/services/KeycloakService";
import { parseBearerToken } from "@/infrastructure/services/auth-header";
import { AppError, BadRequestError } from "@/utils/errors/domain-errors";

export async function GET(request: NextRequest) {
  const keycloakService = container.get<KeycloakService>(SERVICE_TYPES.KeycloakService);
  const jiraExternalApiService = container.get<JiraExternalApiService>(
    SERVICE_TYPES.JiraExternalApiService
  );

  try {
    if (!keycloakService.isAuthDisabled()) {
      const accessToken = parseBearerToken(request.headers.get("authorization"));
      await keycloakService.validateAccessToken(accessToken);
    }

    const projectId = request.nextUrl.searchParams.get("projectId") ?? "";
    if (!projectId.trim()) {
      throw new BadRequestError("projectId is required");
    }

    const metrics = await jiraExternalApiService.getProjectMetrics(projectId);
    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      const message =
        error.statusCode === 400 ? error.message : "Jira no disponible temporalmente";

      return NextResponse.json({ message }, { status: error.statusCode });
    }

    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
