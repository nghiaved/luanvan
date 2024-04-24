const checkStatus = (limit, registered, type) => {
    if (registered === 0) {
        return 'text-black'
    }

    if (limit === registered) {
        return type
    } else {
        return 'text-success'
    }
}

export default checkStatus