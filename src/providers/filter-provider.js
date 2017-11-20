function assign(obj, keyPath, value) {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
        const key = keyPath[i];
        if (!(key in obj)) {
            Object.assign(obj, { [key]: {} });
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

function parseFilter(querystring) {
    let filters = Object.keys(querystring).filter((key) => key.startsWith('filter['));
    filters = filters.map((key) => {
        const splitted = key.split(new RegExp(['\\[', '\\]', ' '].join('|'), 'g'))
            .filter((k) => k !== '').splice(1);
        // return splitted.reduce((o, s) => o[s] = {}, {});
        const filter = {};
        assign(filter, splitted, querystring[key]);
        return filter;
    });

    const result = {};
    for (let i = 0; i < filters.length; i++) {
        const key = Object.keys(filters[i])[0];
        result[key] = filters[i][key];
    }
    return result;
}

function getFilterForResource(resource, userId) {
    if (resource === '/time-entries') {
        return { owner: { id: userId } };
    }
    if (resource === '/invoices') {
        return { owner: { id: userId } };
    }
    if (resource === 'me/organizations') {
        return { owner: { id: userId } };
    }
    return {};
}

function appendAuthFilters(existingFilters, resource, auth) {
    if (auth && auth.principalId) {
        const filter = getFilterForResource(resource, auth.principalId);
        Object.assign(existingFilters, filter);
        console.log(existingFilters);
    }
    return existingFilters;
}

module.exports = (queryString, resource, auth) => {
    let filter = parseFilter(queryString);
    filter = appendAuthFilters(filter, resource, auth);
    return filter;
};
