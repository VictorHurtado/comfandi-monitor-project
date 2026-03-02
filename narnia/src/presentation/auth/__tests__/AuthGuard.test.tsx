import { render, screen, waitFor } from "@testing-library/react";
import { AuthGuard } from "@/presentation/auth/AuthGuard";

const useSessionMock = jest.fn();
const signInMock = jest.fn();
const signOutMock = jest.fn();
const getProvidersMock = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
  signIn: (...args: unknown[]) => signInMock(...args),
  signOut: (...args: unknown[]) => signOutMock(...args),
  getProviders: () => getProvidersMock()
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children when keycloak provider is not available", async () => {
    getProvidersMock.mockResolvedValue({});
    useSessionMock.mockReturnValue({
      status: "authenticated",
      data: { user: { name: "Narnia" } }
    });

    render(
      <AuthGuard>
        <div>Protected view</div>
      </AuthGuard>
    );

    await waitFor(() => expect(getProvidersMock).toHaveBeenCalled());
    expect(screen.getByText("Protected view")).toBeInTheDocument();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("starts keycloak sign in when unauthenticated", async () => {
    getProvidersMock.mockResolvedValue({ keycloak: { id: "keycloak" } });
    useSessionMock.mockReturnValue({
      status: "unauthenticated",
      data: null
    });

    render(
      <AuthGuard>
        <div>Protected view</div>
      </AuthGuard>
    );

    await waitFor(() => expect(signInMock).toHaveBeenCalledWith("keycloak", expect.any(Object)));
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
