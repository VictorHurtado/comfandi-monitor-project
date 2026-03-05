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

  it("shows No se pudo conectar con Sonar when fetch fails", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({ ok: false });

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    await waitFor(() => {
      expect(screen.getByText("No se pudo conectar con Sonar")).toBeInTheDocument();
    });
  });

  it("shows Coverage Bugs and Vulnerabilities when data has metrics", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: "passed",
          sonarProjectKey: "ComfandiTD_afiliaciones",
          projectName: "Afiliaciones",
          coverage: 82.5,
          bugs: 3,
          vulnerabilities: 0
        })
    });

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    await waitFor(() => {
      expect(screen.getByText("83%")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  it("shows Actualizado hace X min when fetchedAt is present", async () => {
    const fetchedAt = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: "passed",
          sonarProjectKey: "ComfandiTD_afiliaciones",
          projectName: "Afiliaciones",
          fetchedAt
        })
    });

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    await waitFor(() => {
      expect(screen.getByText(/Actualizado hace 2 min/)).toBeInTheDocument();
    });
  });

  it("shows sin dato for metrics when values are null", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          status: "passed",
          sonarProjectKey: "ComfandiTD_afiliaciones",
          projectName: "Afiliaciones",
          coverage: null,
          bugs: null,
          vulnerabilities: null
        })
    });

    render(<SonarIntegrationCard projectId="afiliaciones" projectName="Afiliaciones" />);

    await waitFor(() => {
      const sinDato = screen.getAllByText("sin dato");
      expect(sinDato.length).toBeGreaterThanOrEqual(3);
    });
  });
});
