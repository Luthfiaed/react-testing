import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import AuthButtons from "./AuthButtons";
import { createServer } from "../../test/setupMockServer";

async function renderComponent() {
  render(
    // SWR automatically caches user data. SWR is used by useUser hook.
    // We need to reset the cache before every test case
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );

  await screen.findAllByRole("link");
}

/* LEARNING POINT
    Test scoping. In this case, we need a different createServer setup for each test scope 
    (One describe function is one scope)
*/
describe("when user is not signed in", () => {
  // createServer() returns GET '/api/user' returns { user: null }
  createServer([
    {
      path: "/api/user",
      res: () => {
        return { user: null };
      },
    },
  ]);

  test("sign in and sign up are visible", async () => {
    await renderComponent();
    const signInButton = screen.getByRole("link", {
      name: /sign in/i,
    });
    const signUpButton = screen.getByRole("link", {
      name: /sign up/i,
    });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/signin");
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/signup");
  });

  test("sign out is not visible", async () => {
    await renderComponent();
    /* LEARNING POINT
        Use queryBy when you want to assert the non-existence of an element.
        Because it doesn't throw an error when the element is not present.
    */
    const signOutButton = screen.queryByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe("when user is signed in", () => {
  // createServer() returns GET '/api/user' returns { user: { id: 1, email: 'some-email@email.com' } }
  createServer([
    {
      path: "/api/user",
      res: () => {
        return { user: { id: 1, email: "some-email@email.com" } };
      },
    },
  ]);

  test("sign in and sign up are not visible", async () => {
    await renderComponent();
    const signInButton = screen.queryByRole("link", {
      name: /sign in/i,
    });
    const signUpButton = screen.queryByRole("link", {
      name: /sign up/i,
    });
    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test("sign out is visible", async () => {
    await renderComponent();
    const signOutButton = screen.queryByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});

/* LEARNING POINT
    TIP: Use await pause() with screen.debug() to see if there's a change in the rendered DOM. Example:

    screen.debug()
    await pause()
    screen.debug()

    Then compare the two screen.debug() results
*/
const pause = () => {
  new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
};
