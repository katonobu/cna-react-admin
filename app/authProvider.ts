import { AuthProvider } from "react-admin";

const tb_base_url = "https://demo.thingsboard.io:443"
const authProvider = {
    // send username and password to the auth server and get back credentials
    login: ({ username, password}:{username:string, password:string}) => {
        return fetch(tb_base_url + "/api/auth/login", {
            method: "POST",
            headers: {
              "accept": "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "username":username,
              "password":password
            }),
        })
        .then((authResponse)=>{
            if (authResponse.ok) {
                return authResponse.json()
                .then(({token, refreshToken}) => {
//                    console.log("login", token, refreshToken)
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', refreshToken);
                    return Promise.resolve(false);
                })
                .catch((e) => Promise.reject(e))
            }
        })
        .catch((e)=> Promise.reject(e))
    },
    logout: () => {
        localStorage.removeItem('username');
        return Promise.resolve();
/*
        if(localStorage.getItem('username')) {
            fetch(tb_base_url+ "/api/auth/user", {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "X-Authorization": "Bearer " + localStorage.getItem('token')
                }
            })
            .then((userInfoRes)=>{
                userInfoRes.json()
                .then((userInfoJson)=> {
                    return {
                        id: userInfoJson.id.id,
                        fullNameavatar: userInfoJson.firstName + ' ' + userInfoJson.firstName.lastName
                    }
                })
                .catch((e) => Promise.reject(e))
            })
            .catch((e)=> Promise.reject(e))
        } else {
            return Promise.reject(new Error('Not loged in'))
        }

*/        
    },    
    // when the dataProvider returns an error, check if this is an authentication error
    checkError: (error:{status:number}) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    // when the user navigates, make sure that their credentials are still valid
    checkAuth: () => localStorage.getItem('username') ? Promise.resolve() : Promise.reject(),
    // get the user's profile
    getIdentity: () => {
//        return Promise.resolve({id:"123",fullName:"Nobuo Kato"})
        if(localStorage.getItem('username')) {
//            console.log("getIdentity", localStorage.getItem('token'))
            return fetch(tb_base_url+ "/api/auth/user", {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "X-Authorization": "Bearer " + localStorage.getItem('token')
                }
            })
            .then((userInfoRes)=>{
                return userInfoRes.json()
                .then((userInfoJson)=> {
//                    console.log("UserInfo:", userInfoJson)
                    const result = {
                        id: userInfoJson.id.id,
                        fullName: userInfoJson.firstName + ' ' + userInfoJson.lastName
                    }
//                    console.log("getIdentity", result)
                    return result
                })
                .catch((e) => Promise.reject(e))
            })
            .catch((e)=> Promise.reject(e))
        } else {
            return Promise.resolve({id:"123",fullName:"AAAAA"})
        }
    },
    // get the user permissions (optional)
    getPermissions: () => {
        return Promise.resolve(['webserialport'])
    },
}

export default authProvider as AuthProvider;