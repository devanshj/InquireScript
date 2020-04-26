// This shit is way too fire for TypeScript, I mean if I need to statically type this
// probably I'll to write it in Haskell and get some category theory going

const reduceViews = (views, main) => new Promise(reduce => {
    let existingReadViews = [...views].filter(isReadableView)
    let currentViews = [];
    let didSuspend = false
    
    const onRequest = request => {
        if (!isReadableRequest(request)) {
            currentViews.push({ request: omit(request, "resolve", "reject") })
            request.resolve();
            return;
        }

        let existingReadView = existingReadViews.shift()
        let value = undefined
        if (existingReadView && existingReadView.request.id === request.id) {
            value = existingReadView.state.value
        }
        let isValid = (request.props.guard || { checker: () => true }).checker(value)

        currentViews.push({
            request: omit(request, "resolve", "reject"),
            state: {
                value: value,
                validity: isValid ? { isValid } : {
                        isValid,
                        reason: request.props.guard.errorProvider(value)
                    }
            }
        })

        if (isValid && value !== undefined) {
            request.resolve(value)
        } else {
            request.reject("SUSPENDED");
            reduce({ type: "SUSPENDED", views: currentViews })
            didSuspend = true
        }
    }

    main(Object.fromEntries(
        ["readText",
        "readNumber",
        "readDate",
        "readDateRange",
        "readChoiceDropdown",
        "readChoiceList",
        "readStarRating",
        "readHappinessRating",
        "readCheckbox",
        "writeText",
        "writeSpace"]
        .map(type => [type, props =>
            new Promise((resolve, reject) => {
                if (didSuspend) {
                    reject("SUSPENDED");
                    return;
                }
                let id = props.id
                delete props.id
                onRequest({
                    id,
                    type,
                    props,
                    resolve,
                    reject
                })
            })
        ])
    ), guard)
    .then(response => reduce({ status: "COMPLETE", views: currentViews, response }))
    .catch(() => {})
})
export default reduceViews;

const isReadableRequest = r =>
    r.type !== "writeText" && r.type !== "writeSpace"

const isReadableView = v =>
    isReadableRequest(v.request)
    
const guard = {
    required: (fieldName = "this field") => ({
        checker: (r) => r !== undefined && r.trim() !== "",
        errorProvider: () => `${capitalize(fieldName)} is required`
    })
}

const capitalize = (s) => 
    `${s.charAt(0).toUpperCase()}${s.slice(1)}`


const omit = (x, ...ks) => Object.fromEntries(
    Object.entries(x)
    .filter(([k]) => !ks.includes(k))
)