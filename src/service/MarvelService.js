import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=1d225212b3f692c72dee1aa0829e1806';
    const _baseOffset = 600;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`
        ${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_tranformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`
        ${_apiBase}characters/${id}?${_apiKey}`);
        return _tranformCharacter(res.data.results[0])
    }

	const getAllComics = async (offset = 0) => {
		const res = await request(
			`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformComics);
	};

    const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

    const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_tranformCharacter);
	};

    const _tranformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description || "not a found",
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.name,
            pageCount: comics.pageCount ? `${comics.pageCount} p.`
            : "No information about the number of pages",
            description: comics.description || "not a found",
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            language: comics.textObjects[0]?.language || "en-us",
            price: comics.prices[0].price
            ? `${comics.prices[0].price}$`
            : "not available",
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic, getCharacterByName}
}

export default useMarvelService;