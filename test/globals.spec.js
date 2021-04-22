import * as GLOBALS from '../src/globals'

describe("globals", () => {

    it('Api endpoint should be defined', () => {
        expect(GLOBALS.API_ENDPOINT).toBeDefined();
        expect(GLOBALS.API_ENDPOINT).toBe("http://localhost:9080/api/solr/");
    })
});