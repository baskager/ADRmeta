const queries = {
    sparql: {
        'getPortraits':
            `PREFIX dc: <http://purl.org/dc/elements/1.1/>
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
            PREFIX person: <http://schema.org/>
            PREFIX schema: <http://schema.org/>

            SELECT * WHERE {

              ?cho dc:type ?type .

              ?cho dc:creator ?creator.

              ?cho sem:hasBeginTimeStamp ?beginTime .

              ?cho dc:description ?description .

              ?cho dc:title ?title .

              ?cho foaf:depiction ?img .

              FILTER REGEX(?title, ' portret ')

          }`
    }
};

export default queries;
