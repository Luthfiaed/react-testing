import { screen, render } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

test("displays the required repository data", () => {
  const repository = {
    language: "Javascript",
    stargazers_count: 5,
    forks: 30,
    open_issues: 1,
  };
  render(<RepositoriesSummary repository={repository} />);

  for (let key in repository) {
    const value = repository[key];
    /* LEARNING POINT 
    - When you get element by text, the actual displayed text might differ from the data coming in.
        For example, here the data "30" (from property forks) will be displayed as "30 Forks".
        Without putting value in RegExp(value) initialization, the test will fail because it will be
        looking for an element that contains the text "30" only
    */
    const element = screen.getByText(new RegExp(value));
    expect(element).toBeInTheDocument();
  }
});
