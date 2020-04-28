// This shit is way too fire for TypeScript, I mean if I need to statically type this
// probably I'll to write it in Haskell, with higher kinded types and get some category theory going

const reduceViews = (views, main) => new Promise(reduce => {
    let existingReadViews = [...views].filter(isStatefulView)
    let currentViews = [];
    let didSuspend = false
    
    const onRequest = request => {
        if (!isReadRequest(request)) {
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

    main({ ui: Object.fromEntries(
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
    ), guard })
    .then(response => reduce({ status: "COMPLETE", views: currentViews, response }))
    .catch(e => e !== "SUSPENDED" && Promise.reject(e))
})
export default reduceViews;

const guard = {
    required: l => ({
        checker: v => v !== undefined && (typeof v === "string" ? v.trim() !== "" : true),
        errorProvider: () => `${l[0].toUpperCase()}${l.slice(1)} is required`
    }),
    pipe: (...guards) =>
        ({
            checker: v =>
                guards.reduce(
                    (doesPass, guard) =>
                        doesPass === false ? false : guard.checker(v),
                    true
                ),
            errorProvider: v =>
                guards.reduce(
                    (error, guard) =>
                        error !== null
                            ? error
                            : guard.checker(v) === false 
                                ? guard.errorProvider(v)
                                : error,
                    null
                ),
        })
}

const isReadRequest = r =>
    r.type !== "writeText" && r.type !== "writeSpace"

const isStatefulView = v =>
    isReadRequest(v.request)

const omit = (x, ...ks) => Object.fromEntries(
    Object.entries(x)
    .filter(([k]) => !ks.includes(k))
)