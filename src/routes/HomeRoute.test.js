import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeRoute from "./HomeRoute";
import { createServer } from "../test/setupMockServer";

/* 
LEARNING POINT
    MSW setup
*/
createServer([
  {
    path: "/api/repositories",
    res: (req, _res, _ctx) => {
      const queriedLanguage = req.url.searchParams
        .get("q")
        .split("language:")[1];
      return {
        items: [
          /*
            LEARNING POINT
            If the result of your data fetch depends on the parameter,
            it's best practice to customize your mock data to reflect the data fetch query/parameters
                          
            In this example, the data result depends on the programming language being requested
            (as shown in query parameter). Then the below mock data should reflect that relationship
            between the dynamic parameter and the data result
        */
          { id: 1, full_name: `${queriedLanguage}_one` },
          { id: 2, full_name: `${queriedLanguage}_two` },
        ],
      };
    },
  },
]);

test("renders two links for each language", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  for (let lang of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${lang}_`),
    });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${lang}_one`);
    expect(links[1]).toHaveTextContent(`${lang}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${lang}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${lang}_two`);
  }
});
