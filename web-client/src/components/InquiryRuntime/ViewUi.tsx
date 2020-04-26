import React, { useState } from "react"
import { View } from ".";
import { Runtime } from "@inquirescript/runtime-types"

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


const ViewUi = ({ view, onStateValue }: {
    view: View.Any,
    onStateValue: (value: View.Stateful["state"]["value"]) => void
}) => (
    isViewOfType(view, "readText") ? <ReadTextUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "readNumber") ? <ReadNumberUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "readDate") ? <ReadDateUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "readDateRange") ? <ReadDateRangeUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "readChoiceDropdown") ? <ReadChoiceDropdownUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "readChoiceList") ? <ReadChoiceListUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "readStarRating") ? <ReadStarRatingUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "readHappinessRating") ? <ReadHappinessRatingUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "readCheckbox") ? <ReadCheckboxUi view={view} onStateValue={onStateValue} /> :
    isViewOfType(view, "writeText") ? <WriteTextUi view={view} /> :
    isViewOfType(view, "writeSpace") ? <WriteSpaceUi view={view} /> :
    <></>
)

export default ViewUi;

const ReadTextUi = ({ view, onStateValue }: {
    view: View.FromType<"readText">,
    onStateValue: (value: View.FromType<"readText">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
            <Input
                value={value || view.request.props.defaultValue || ""}
                onChange={e => onStateValue(e.currentTarget.value)}
                type={props.type}
                onBlur={() => setIsDirty(true)} /> 
    </FormControl>
}

const ReadNumberUi = ({ view, onStateValue }: {
    view: View.FromType<"readNumber">,
    onStateValue: (value: View.FromType<"readNumber">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;
    let [internalValue, setInternalValue] = useState(value || props.defaultValue || "")

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
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

const ReadDateUi = ({ view, onStateValue }: {
    view: View.FromType<"readDate">,
    onStateValue: (value: View.FromType<"readDate">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
            <Datepicker
                value={value || props.defaultValue}
                onChange={(({ date }: { date: null | Date }) => {
                    onStateValue(date === null ? undefined : date)
                }) as any}
                minDate={props.min}
                maxDate={props.max}
                timeSelectStart={props.hasTime}
                onClose={() => setIsDirty(true)} /> 
    </FormControl>
}

const ReadDateRangeUi = ({ view, onStateValue }: {
    view: View.FromType<"readDateRange">,
    onStateValue: (value: View.FromType<"readDateRange">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;
    let [internalValue, setInternalValue] = useState(value || props.defaultValue as any)

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
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
                minDate={props.min}
                maxDate={props.max}
                timeSelectStart={props.hasTimeStart}
                timeSelectEnd={props.hasTimeEnd}
                onClose={() => setIsDirty(true)} /> 
    </FormControl>
}


const ReadChoiceDropdownUi = ({ view, onStateValue }: {
    view: View.FromType<"readChoiceDropdown">,
    onStateValue: (value: View.FromType<"readChoiceDropdown">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;
    let [internalValue, setInternalValue] = useState(value || props.defaultValue as any)

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
            <Select
                options={props.options.map(option =>
                    ({
                        label: props.labelProvider(option),
                        id: props.valueProvider(option)
                    })
                )}
                value={internalValue}
                onChange={({ value }) => {
                    setInternalValue(value)
                    onStateValue(
                        props.options.find(option => props.valueProvider(option) === value[0].id)
                    )
                }}
                searchable={false}
                clearable={false}
                onBlur={() => setIsDirty(true)} />
    </FormControl>
}


const ReadChoiceListUi = ({ view, onStateValue }: {
    view: View.FromType<"readChoiceList">,
    onStateValue: (value: View.FromType<"readChoiceList">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props, id }, state: { value, validity } } = view;

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
            <RadioGroup
                value={props.valueProvider(value || props.defaultOption)}
                onChange={e =>
                    onStateValue(
                        props.options.find(option =>
                            props.valueProvider(option) === e.currentTarget.value
                        )
                    )
                }
                onBlur={() => setIsDirty(true)}
                name={id.toString()}
                align={ALIGN.vertical}>
                    {props.options.map(option =>
                        <Radio value={props.valueProvider(option)} key={props.valueProvider(option)}>
                            {props.labelProvider(option)}
                        </Radio>
                    )}
            </RadioGroup>
    </FormControl>
}


const ReadStarRatingUi = ({ view, onStateValue }: {
    view: View.FromType<"readStarRating">,
    onStateValue: (value: View.FromType<"readStarRating">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
            <StarRating
                value={value}
                onChange={({ value }) => {
                    onStateValue(value)
                    setIsDirty(true)
                }}
                numItems={props.total} />
    </FormControl>
}


const ReadHappinessRatingUi = ({ view, onStateValue }: {
    view: View.FromType<"readHappinessRating">,
    onStateValue: (value: View.FromType<"readHappinessRating">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
            <EmoticonRating
                value={value}
                onChange={({ value }) => {
                    onStateValue(value)
                    setIsDirty(true)
                }} />
    </FormControl>
}

const ReadCheckboxUi = ({ view, onStateValue }: {
    view: View.FromType<"readCheckbox">,
    onStateValue: (value: View.FromType<"readCheckbox">["state"]["value"]) => void
}) => {
    let [isDirty, setIsDirty] = useState(false);
    let { request: { props }, state: { value, validity } } = view;

    return <FormControl
        label={props.label}
        caption={props.helpText}
        error={!validity.isValid && isDirty ? validity.reason : false}>
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


const isViewOfType = <T extends keyof Runtime>(view: View.Any, type: T): view is View.FromType<T> =>
	view.request.type === type