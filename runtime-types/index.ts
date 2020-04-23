export type Main =
	(runtime: Runtime) => string[] | undefined

export type Runtime = 
  { read:
    { text: (props: ReadTextProps) => Promise<string>
    , maskedText: (props: ReadMaskedTextProps) => Promise<string>
    , number: (props: ReadNumberProps) => Promise<number>
    , date: (props: ReadDateProps) => Promise<Date>
    , dateRange: (props: ReadDateRangeProps) => Promise<[Date, Date]>
    , choiceDropdown: <T>(props: ReadChoiceDropdownProps<T>) => Promise<T>
    , choiceList: <T>(props: ReadChoiceListProps<T>) => Promise<T>
    , starRating: (props: ReadStarRatingProps) => Promise<number>
    , happinessRating: (props: ReadHappinessRatingProps) => Promise<number>
    , checkbox: (props: ReadCheckboxProps) => Promise<boolean>
    , orderableList: <T>(props: ReadOrderableListProps<T>) => Promise<T>
    }
  , write: 
    { text: (props: WriteTextProps) => Promise<void>
    , submitButton: (props?: WriteSubmitButtonProps) => Promise<boolean>
    }
  }

export type ReadTextProps =
  & { defaultValue?: string
    , style?: "email" | "password"
    }
  & CommonReadProps<string>

export type ReadMaskedTextProps =
  & { defaultValue?: string
    , mask: string
    }
  & CommonReadProps<string>


export type ReadNumberProps =
  & { defaultValue?: number
    , min?: number
    , max?: number
    }
  & CommonReadProps<string>

export type ReadDateProps =
  & { defaultValue?: Date
    , min?: Date
    , max?: Date
    , hasTime?: boolean
    }
  & CommonReadProps<string>

export type ReadDateRangeProps =
  & { defaultValue?: Date
    , min?: Date
    , max?: Date
    , hasTimeStart?: boolean
    , hasTimeEnd?: boolean
    , hasQuickSelect?: boolean
    }
  & CommonReadProps<string>

export type ReadChoiceDropdownProps<T> = 
  & { options: T[] | Promise<T[]>
    , labelProvider: (option: T) => string
    , isMultiselect?: boolean
    , isSearchable?: boolean
    , defaultValue?: T 
    }
  & CommonReadProps<T>

export type ReadChoiceListProps<T> = 
  & { options: T[] | Promise<T[]>
    , labelProvider: (option: T) => string
    , isMultiselect?: boolean
    , defaultValue?: T 
    , isOtherable: boolean
    }
  & CommonReadProps<T>

export type ReadStarRatingProps =
  & { total?: number }
  & CommonReadProps<number>

export type ReadHappinessRatingProps =
  & {}
  & CommonReadProps<number>

export type ReadCheckboxProps =
  { defaultValue?: boolean
  }
  & CommonReadProps<boolean>

export type ReadOrderableListProps<T> = 
  & { items: T[] | Promise<T[]>
    , labelProvider: (option: T) => string
    }
  & CommonReadProps<T>

export type ReadButtonProps<T> = 
  & { items: T[] | Promise<T[]>
    , labelProvider: (option: T) => string
    }
  & CommonReadProps<T>

export type CommonReadProps<T> =
  { label: string
  , labelExplanation?: string
  , helpText?: string 
  , validator?: (result: T) => boolean | Promise<boolean> }

export type WriteTextProps =
  { content: string
  , size?:
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "heading-4"
    | "heading-5"
    | "heading-6"
    | "paragraph-1"
    | "paragraph-2"
    | "paragraph-3"
    | "paragraph-4"
    | "label-1"
    | "label-2"
    | "label-3"
    | "label-4"
  }

export type WriteSubmitButtonProps = 
  { text?: string }