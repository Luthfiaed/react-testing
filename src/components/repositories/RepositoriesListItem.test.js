import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RepositoriesListItem from "./RepositoriesListItem";

/* LEARNING POINT 
    Mocking a component. 
    Please only do this if the component you're mocking is not the focus functionality we are testing.
*/
// jest.mock("../tree/FileIcon", () => {
//   return () => {
//     return "File Icon Component";
//   };
// });

/* LEARNING POINT
    Write helper function for the tests (usually a render helper) to avoid writing repetitive code
*/
function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A js library",
    owner: { login: "facebook" },
    name: "react",
    html_url: "https://github.com/",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository };
}

test("shows a link to the github repository", async () => {
  const { repository } = renderComponent();

  /* LEARNING POINT
        In RepositoriesListItem.js, there's a FileIcon component that has a useEffect in the component.
        Without the below await findBy code, the test will run into an .act() error because there's
        a state change and/or useEffect run without us handling it.

        Using await + findBy is the preferred solution to .act() error. 
        Another solution is to mock FileIcon (see first LEARNING POINT in this file)
  */
  await screen.findByRole("img", { name: "Javascript" });

  const link = screen.getByRole("link", { name: /github repository/i });
  expect(link).toHaveAttribute("href", repository.html_url);
});

test("shows a fileicon with the appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", { name: "Javascript" });
  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { repository } = renderComponent();

  await screen.findByRole("img", { name: "Javascript" });

  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });
  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});
