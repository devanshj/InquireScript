import React, { useState } from "react"
import { View } from ".";
import { Ui } from "@inquirescript/runtime-types"

import {
    DisplayLarge,
    DisplayMedium,
    DisplaySmall,
    DisplayXSmall,
    HeadingXXLarge,
    HeadingXLarge,
    HeadingLarge,
    HeadingMedium,
    HeadingSmall,
    HeadingXSmall,
    LabelLarge,
    LabelMedium,
    LabelSmall,
    LabelXSmall,
    ParagraphLarge,
    ParagraphMedium,
    ParagraphSmall,
    ParagraphXSmall,
} from "baseui/typography"
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Block } from "baseui/block";
import { RadioGroup, Radio, ALIGN } from "baseui/radio";
import { Datepicker } from "baseui/datepicker"
import { Select } from "baseui/select";
import { StarRating, EmoticonRating } from "baseui/rating"
import { Checkbox } from "baseui/checkbox"


const ViewUi = ({ view, onStateValue, isDisabled }: {
    view: View.Any,
    onStateValue: (value: View.Stateful["state"]["value"]) => void,
    isDisabled: boolean
}) => (
    isViewOfType(view, "readText") ? <ReadTextUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "readNumber") ? <ReadNumberUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "readDate") ? <ReadDateUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "readDateRange") ? <ReadDateRangeUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "readChoiceDropdown") ? <ReadChoiceDropdownUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "readChoiceList") ? <ReadChoiceListUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "readStarRating") ? <ReadStarRatingUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "readHappinessRating") ? <ReadHappinessRatingUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "readCheckbox") ? <ReadCheckboxUi view={view} onStateValue={onStateValue} isDisabled={isDisabled}/> :
    isViewOfType(view, "writeText") ? <WriteTextUi view={view} /> :
    isViewOfType(view, "writeSpace") ? <WriteSpaceUi view={view} /> :
    <></>
)

export default ViewUi;

const ReadTextUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readText">,
    onStateValue: (value: View.FromType<"readText">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label + (props.guard?.checker(undefined) === false ? " *" : "")}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            <Input
                value={value || view.request.props.defaultValue || ""}
                onChange={e => onStateValue(e.currentTarget.value)}
                type={props.type}
                onBlur={() => setIsDirty(true)} /> 
    </FormControl>
}

const ReadNumberUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readNumber">,
    onStateValue: (value: View.FromType<"readNumber">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;
    let [internalValue, setInternalValue] = useState(value || props.defaultValue || "")

    return <FormControl
        label={props.label + (props.guard?.checker(undefined) === false ? " *" : "")}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            <Input
                value={internalValue}
                onChange={e => {
                    let _internalValue = e.currentTarget.value
                    setInternalValue(_internalValue)

                    onStateValue(_internalValue !== "" ? Number(_internalValue) : undefined)
                }}
                type="number"
                onBlur={() => setIsDirty(true)} /> 
    </FormControl>
}

const ReadDateUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readDate">,
    onStateValue: (value: View.FromType<"readDate">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label + (props.guard?.checker(undefined) === false ? " *" : "")}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            <Datepicker
                value={value || props.defaultValue}
                onChange={(({ date }: { date: null | Date }) => {
                    onStateValue(date === null ? undefined : date)
                }) as any}
                timeSelectStart={props.hasTime}
                onClose={() => setIsDirty(true)} /> 
    </FormControl>
}

const ReadDateRangeUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readDateRange">,
    onStateValue: (value: View.FromType<"readDateRange">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;
    let [internalValue, setInternalValue] = useState(value || props.defaultValue as any)

    return <FormControl
        label={props.label + (props.guard?.checker(undefined) === false ? " *" : "")}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            <Datepicker
                value={internalValue}
                onChange={({ date }) => {
                    setInternalValue(date)  
                    let _internalValue = date

                    if (
                        Array.isArray(_internalValue) &&
                        _internalValue.length === 2 &&
                        _internalValue.every(x => x instanceof Date)
                    ) {
                        onStateValue(_internalValue as any)
                    }
                }}
                timeSelectStart={props.hasTimeStart}
                timeSelectEnd={props.hasTimeEnd}
                onClose={() => setIsDirty(true)} /> 
    </FormControl>
}


const ReadChoiceDropdownUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readChoiceDropdown">,
    onStateValue: (value: View.FromType<"readChoiceDropdown">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;
    let [internalValue, setInternalValue] =
      useState(value || props.defaultValue ? [props.defaultValue] : [] as any)

    let [valueProvider, labelProvider] =
        (props.options as any[]).every(o => typeof o === "string")
            ? [(o: any) => o, (o: any) => o]
            : [assertiveGet(props, "valueProvider"), assertiveGet(props, "labelProvider")]

    return <FormControl
        label={props.label + (props.guard?.checker(undefined) === false ? " *" : "")}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            <Select
                options={(props.options as any[]).map(option =>
                    ({
                        label: labelProvider(option),
                        id: valueProvider(option)
                    })
                )}
                value={internalValue}
                valueKey="id"
                labelKey="label"
                onChange={({ value: selectedOptions }) => {
                    setInternalValue(selectedOptions)
                    onStateValue(
                        props.isMultiple
                            ? selectedOptions.map(o =>
                                props.options.find(option =>
                                    valueProvider(option) === o.id
                                )
                            ) as any
                            : props.options.find(option =>
                                valueProvider(option) === selectedOptions[0].id
                            ) as any
                    )
                }}
                searchable={false}
                clearable={false}
                onBlur={() => setIsDirty(true)} />
    </FormControl>
}


const ReadChoiceListUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readChoiceList">,
    onStateValue: (value: View.FromType<"readChoiceList">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props, id }, state: { value, validity } } = view;

    let [valueProvider, labelProvider] =
        (props.options as any[]).every(o => typeof o === "string")
            ? [(o: any) => o, (o: any) => o]
            : [assertiveGet(props, "valueProvider"), assertiveGet(props, "labelProvider")]

    return <FormControl
        label={props.label + (props.guard?.checker(undefined) === false ? " *" : "")}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            {!props.isMultiple
                ? <RadioGroup
                    value={valueProvider(value || props.defaultValue)}
                    onChange={e =>
                        onStateValue(
                            (props.options as any[]).find(option =>
                                valueProvider(option) === e.currentTarget.value
                            )
                        )
                    }
                    onBlur={() => setIsDirty(true)}
                    name={id.toString()}
                    align={ALIGN.vertical}>
                        {(props.options as any[]).map(option =>
                            <Radio value={valueProvider(option)} key={valueProvider(option)}>
                                {labelProvider(option)}
                            </Radio>
                        )}
                </RadioGroup>
                : <Block flexDirection="column">
                    {(props.options as any[]).map(option =>
                        <Checkbox
                            key={valueProvider(option)}
                            checked={value === undefined ? false : (value as string[]).includes(valueProvider(option))}
                            onChange={e => onStateValue(
                                [...((value || []) as string[]).flatMap(o =>
                                    o === valueProvider(option)
                                        ? e.currentTarget.checked
                                            ? [o]
                                            : []
                                        : [o]
                                ), ...(e.currentTarget.checked ? [valueProvider(option)] : [])]
                            )}
                            overrides={{
                                Root: {
                                    style: ({ $theme }) => ({
                                        marginTop: $theme.sizing.scale200,
                                        marginBottom: $theme.sizing.scale200
                                    })
                                }
                            }}>
                                {labelProvider(option)}
                        </Checkbox>
                    )}
                </Block>
            }
    </FormControl>
}

const assertiveGet = (x: unknown, k: string) => (x as any)[k]

const ReadStarRatingUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readStarRating">,
    onStateValue: (value: View.FromType<"readStarRating">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label + (props.guard?.checker(undefined) === false ? " *" : "")}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            <StarRating
                value={value}
                onChange={({ value }) => {
                    onStateValue(value)
                    setIsDirty(true)
                }}
                numItems={props.total} />
    </FormControl>
}


const ReadHappinessRatingUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readHappinessRating">,
    onStateValue: (value: View.FromType<"readHappinessRating">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label + (props.guard?.checker(undefined) === false ? " *" : "")}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            <EmoticonRating
                value={value}
                onChange={({ value }) => {
                    onStateValue(value)
                    setIsDirty(true)
                }} />
    </FormControl>
}

const ReadCheckboxUi = ({ view, onStateValue, isDisabled }: {
    view: View.FromType<"readCheckbox">,
    onStateValue: (value: View.FromType<"readCheckbox">["state"]["value"]) => void,
    isDisabled: boolean
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : null}
        disabled={isDisabled}>
            <Checkbox
                checked={value || props.defaultValue}
                onChange={e => onStateValue(e.currentTarget.checked)}
                onBlur={() => setIsDirty(true)} />
    </FormControl>
}


const WriteTextUi = ({ view }: { view: View.FromType<"writeText"> }) => {
    let size = view.request.props.size || "paragraph-medium";
    let content = view.request.props.content

    if (size === "display-large") return <DisplayLarge>{content}</DisplayLarge>
    if (size === "display-medium") return <DisplayMedium>{content}</DisplayMedium>
    if (size === "display-small") return <DisplaySmall>{content}</DisplaySmall>
    if (size === "display-x-small") return <DisplayXSmall>{content}</DisplayXSmall>
    if (size === "heading-xx-large") return <HeadingXXLarge>{content}</HeadingXXLarge>
    if (size === "heading-x-large") return <HeadingXLarge>{content}</HeadingXLarge>
    if (size === "heading-large") return <HeadingLarge>{content}</HeadingLarge>
    if (size === "heading-medium") return <HeadingMedium>{content}</HeadingMedium>
    if (size === "heading-small") return <HeadingSmall>{content}</HeadingSmall>
    if (size === "heading-x-small") return <HeadingXSmall>{content}</HeadingXSmall>
    if (size === "label-large") return <LabelLarge>{content}</LabelLarge>
    if (size === "label-medium") return <LabelMedium>{content}</LabelMedium>
    if (size === "label-small") return <LabelSmall>{content}</LabelSmall>
    if (size === "label-x-small") return <LabelXSmall>{content}</LabelXSmall>
    if (size === "paragraph-large") return <ParagraphLarge>{content}</ParagraphLarge>
    if (size === "paragraph-medium") return <ParagraphMedium>{content}</ParagraphMedium>
    if (size === "paragraph-small") return <ParagraphSmall>{content}</ParagraphSmall>
    if (size === "paragraph-x-small") return <ParagraphXSmall>{content}</ParagraphXSmall>
    return <></>
}

const WriteSpaceUi = ({ view }: { view: View.FromType<"writeSpace"> }) =>
    <Block height={view.request.props.size || "scale300"} />


const isViewOfType = <T extends keyof Ui>(view: View.Any, type: T): view is View.FromType<T> =>
	view.request.type === type