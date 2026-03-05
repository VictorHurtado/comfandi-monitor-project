import { render, screen, waitFor } from "@testing-library/react";
import { SonarIntegrationCard } from "../SonarIntegrationCard";

const originalFetch = globalThis.fetch;

describe("SonarIntegrationCard", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("renders SonarQube title and project name", () => {
    (globalThis.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves - loading state
    );

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    expect(screen.getByText("SonarQube")).toBeInTheDocument();
    expect(screen.getByText("Afiliaciones")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    (globalThis.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    expect(screen.getByText("Cargando Quality Gate...")).toBeInTheDocument();
  });

  it("shows PASSED when quality gate is ok", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: "passed",
          sonarProjectKey: "ComfandiTD_afiliaciones",
          projectName: "Afiliaciones"
        })
    });

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    await waitFor(() => {
      expect(screen.getByText("PASSED")).toBeInTheDocument();
    });
  });

  it("shows FAILED when quality gate failed", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: "failed",
          sonarProjectKey: "ComfandiTD_afiliaciones",
          projectName: "Afiliaciones"
        })
    });

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    await waitFor(() => {
      expect(screen.getByText("FAILED")).toBeInTheDocument();
    });
  });

  it("shows Sonar no disponible when fetch fails", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false });

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    await waitFor(() => {
      expect(screen.getByText("Sonar no disponible")).toBeInTheDocument();
    });
  });
});
