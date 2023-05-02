const getUserInfoFromDB = async () => {
    loadingInfo.innerHTML = 'Loading user information from the database'
    const options = {
        method: "GET",
        credentials: "include"
    }

    await fetch(`http://${backendIPAddress}/users`, options)
        .then((response) => response.json())
        .then((data) => {
            data.filter((data) => data.userid === userid)
                .map((data) => {
                    isUserInDB = true
                    itemidsFromDB = data.itemids
                })
        })
}

const addNewUserInfoToDB = async () => {
    loadingInfo.innerHTML = 'Adding new user information to the database'
    const itemToAdd = {
        userid: userid,
        itemids: itemidsFromDB
    }
    const options = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToAdd)
    }

    await fetch(`http://${backendIPAddress}/users`, options)
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
}

const updateItemidsInDB = async (newItemids) => {
    const options = {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemids: newItemids })
    }

    await fetch(`http://${backendIPAddress}/users/${userid}`, options)
        .then((response) => console.log(response))
        .catch((err) => console.log(err))
}

