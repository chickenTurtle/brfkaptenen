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

    console.log(startDate, endDate)
    const url = process.env.REACT_APP_API_URL + 'create';
    return post(url, user.accessToken, { startDate, endDate });
};

export let getEvents = (user) => {
    const url = process.env.REACT_APP_API_URL + 'listevents';
    return get(url, user.accessToken);
};

export let deleteBooking = (user, id) => {
    const url = process.env.REACT_APP_API_URL + 'delete';
    return post(url, user.accessToken, { id });
};

export let signUp = (name, email, password) => {
    const url = process.env.REACT_APP_API_URL + 'signup';
    return post(url, null, { name, email, password }).then((r) => r)
};