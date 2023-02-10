import { IOmdbResponse } from "../models/IOmdbResponse";
import { IMovie } from "../models/Movie";
import axios from "axios";

export const getData = async (searchText: string): Promise<IMovie[]> => {
  return axios
    .get<IOmdbResponse>("http://omdbapi.com/?apikey=52a4703c&s=" + searchText)
    .then((data) => {
      return data.data.Search;
    })
    .catch(() => {
      return [];
    });
};
