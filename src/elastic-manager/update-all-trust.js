const axios = require('axios');

module.exports = async function elasticUpdateAllTrust() {
    console.log('update all trust in elastic documents;');
    console.log('requested documents');

    const documents = await getAllDocuments();
    console.log('received documents');

    console.log('start update');
    console.log(documents.length);

    for (i = 0; i < documents.length; i++) {
        doc = documents[i];
        const placeHolderDescription = '<ul><li>Dit zijn de aandachtspunten voor de betrouwbaarheid van deze bron. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li><li>Praesent scelerisque vel arcu non porttitor. Phasellus nec pretium eros. </li><li>Maecenas elit erat, lobortis et dictum vitae, dignissim eu magna.</li></ul>'
        const now = new Date();
        switch (doc.source_name) {
            case 'De Tijd':
            case 'De standaard':
            case 'De Morgen':
            case 'vrt nws':
                doc.trust_score = 9;
                doc.trust_description = placeHolderDescription;
                doc.trust_written_by = 'Jan Janssens';
                doc.trust_last_update = now.toISOString();

                break;
            case 'Het Belang van Limburg':
            case 'Gazet van Antwerpen':
            case 'Het Nieuwsblad':
            case 'Bruzz':
            case 'Het Laatste Nieuws':
                doc.trust_score = 8,
                    doc.trust_description = placeHolderDescription;
                doc.trust_written_by = 'Jane dhoe';
                doc.trust_last_update = now.toISOString();
                break;
            case 'MO':
            case 'MO*':
                doc.trust_score = 7,
                    doc.trust_description = placeHolderDescription;
                doc.trust_written_by = 'Axelle Vanden Eynde';
                doc.trust_last_update = now.toISOString();
                break;
            case 'Apache':
            case 'Doorbraak':
            case 'De Wereld Morgen':
                doc.trust_score = 5,
                    doc.trust_description = placeHolderDescription;
                doc.trust_written_by = 'Axelle Vanden Eynde';
                doc.trust_last_update = now.toISOString();
                break;

            default:
                break;
        }
        const elasticUrl = 'https://enterprise-search-deployment-2e3053.ent.westeurope.azure.elastic-cloud.com/api/as/v1/engines/unify/documents';
        const update = await axios(elasticUrl, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer private-txvmuhndnkhx9an5eqybky8b",
            },
            data: JSON.stringify([doc])
        })
        console.log(await update.data);
        console.log('count: ' + i);
    }
    console.log('all documents updated');
}

async function getTotalNumberOfDocuments() {

    const elasticUrl = 'https://enterprise-search-deployment-2e3053.ent.westeurope.azure.elastic-cloud.com/api/as/v1/engines/unify/documents/list';
    const response = await axios(elasticUrl, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer private-txvmuhndnkhx9an5eqybky8b",
        },
        data: {
            "page": {
                "current": 1,
                "size": 1
            }
        }
    }).catch((err) => {
        console.log(err);
    })
    return response.data.meta.page.total_results;
}

async function getAllDocuments() {
    const numberOfDocuments = await getTotalNumberOfDocuments();
    const pageSize = 100;
    const NumberOfPages = Math.ceil(numberOfDocuments / pageSize);
    let documents = [];

    for (let currentPage = 1; currentPage <= NumberOfPages; currentPage++) {
        const elasticUrl = 'https://enterprise-search-deployment-2e3053.ent.westeurope.azure.elastic-cloud.com/api/as/v1/engines/unify/documents/list';
        const response = await axios(elasticUrl, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer private-txvmuhndnkhx9an5eqybky8b",
            },
            data: {
                "page": {
                    "current": currentPage,
                    "size": pageSize
                }
            }
        }).catch((err) => {
            console.log(err);
        })
        documents.push(...response.data.results);
    };

    return documents;

}