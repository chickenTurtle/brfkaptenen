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
    const url = process.env.REACT_APP_API_URL + 'create';

    post(url, user.accessToken, { startDate, endDate }).then((res) => {
        res.text().then((r) => console.log(r));
    });
};

export let deleteBooking = (user, id) => {
    const url = process.env.REACT_APP_API_URL + 'delete';

    post(url, user.accessToken, { id }).then((res) => {
        res.text().then((r) => console.log(r));
    });
};

export let signUp = (name, email, password) => {
    const url = process.env.REACT_APP_API_URL + 'signup';
    return post(url, null, { name, email, password })
};