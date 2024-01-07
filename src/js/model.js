import { async } from "regenerator-runtime";
import { API_URL, KEY } from "./config";
import { AJAX } from "./helpers";
import { RES_PER_PAGE } from "./config";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: false,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some((rec) => rec.id === id);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  if (page < 1) page = state.search.page;

  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = state.search.resultsPerPage + start - 1;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);
  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  // mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// debugging function
const clearBookmarks = function () {
  localStorage.clear();
};

export const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(
      (entry) => entry[0].startsWith("ingredient") && entry[1].trim() !== ""
    )
    .map((entry) => {
      let words = entry[1].split(",", 3).map((word) => word.trim());
      const [quantity, unit, description] = [
        ...words,
        ...new Array(3 - words.length).fill(""),
      ];
      return { quantity: quantity ? +quantity : null, unit, description };
    });

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
  };
  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);
};
const newRecipe = {
  image: "TEST",
  "ingredient-1": "0.5,kg,Rice",
  "ingredient-2": "1,,Avocado",
  "ingredient-3": ",,salt",
  "ingredient-4": "",
  cookingTime: "23",
  "ingredient-5": "",
  "ingredient-6": "",
  publisher: "TEST",
  servings: "23",
  sourceUrl: "TEST",
  title: "TEST",
};

// uploadRecipe(newRecipe);
