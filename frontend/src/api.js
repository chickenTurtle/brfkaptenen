let baseUrl = process.env.NODE_ENV === "production" ? "" : process.env.REACT_APP_API_URL;

let get = (url, auth) => {
    return fetch(url, {
        headers: auth ? new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth
        }) : null
    })
}

let post = (url, auth, body) => {
    return fetch(url, {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth
        }),
        body: JSON.stringify(body)
    })
}

export let book = (user, startDate, endDate) => {
    startDate.setHours(12);
    endDate.setHours(12);
    const url = baseUrl + '/api/create';
    return post(url, user.accessToken, { startDate, endDate });
};

export let getEvents = (user) => {
    const url = baseUrl + '/api/listevents';
    return get(url, user.accessToken);
};

export let deleteBooking = (user, id) => {
    const url = baseUrl + '/api/delete';
    return post(url, user.accessToken, { id });
};

export let signUp = (name, email, password) => {
    const url = baseUrl + '/api/signup';
    return post(url, null, { name, email, password }).then((r) => r)
};