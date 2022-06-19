# Task 1
```sh
npm run test ./__test__/task1.test.js
```


# Task 2
```sh
npm run test ./__test__/task2.test.js
```

# Task 3
Request -> \
Method: POST \
Headers: Content-type: application/json \
https://someUrl/login <insert answer here> 

```json 
{
    "name": "some name",
    "pass": "password"
}
``` 

Response ->

### Successful
Status Code: 200
```json
{
    "name": "some name",
    // ...some other information
}
```

### Unsuccessful
Status Code: 403
```json
{
    "error": "SOME_ERR_MESSAGE",
    /* 
    e.g. 
    WRONG_PASS
    BLOCKED
    ...some other message 
    */
}
```

## Test Scenarios
- Wrong password
- Account blocked or not (if there is an account blocking scheme)
- Role checking (RBAC)
