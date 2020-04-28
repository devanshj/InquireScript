export interface Main
	{ (runtime: Runtime): Promise<string[] | void> }

export interface Runtime
  { ui: Ui, guard: GuardHelper }

export interface Ui 
  { readText: ReadText
  , readNumber: ReadNumber
  , readDate: ReadDate
  , readDateRange: ReadDateRange
  , readChoiceDropdown: ReadChoiceDropdown
  , readChoiceList: ReadChoiceList
  , readStarRating: ReadStarRating
  , readHappinessRating: ReadHappinessRating
  , readCheckbox: ReadCheckbox
  , writeText: WriteText
  , writeSpace: WriteSpace
  }


// -----------------------

export interface ReadText
  { <T extends string | undefined>(props: ReadTextProps<T>): Promise<T>}

export interface ReadTextProps<T extends string | undefined> extends CommonReadProps<T, string | undefined>
  { defaultValue?: string
  , type?: "email" | "password"
  }
  

// -----------------------

export interface ReadNumber
  { <T extends number | undefined>(props: ReadNumberProps<T>): Promise<T>
  }

export interface ReadNumberProps<T extends number | undefined> extends CommonReadProps<T, number | undefined>
  { defaultValue?: number }


// -----------------------

export interface ReadDate
  { <T extends Date | undefined>(props: ReadDateProps<T>): Promise<T> }

export interface ReadDateProps<T extends Date | undefined> extends CommonReadProps<T, Date | undefined>
  { defaultValue?: Date
  , hasTime?: boolean
  }

// -----------------------

export interface ReadDateRange
  { <T extends [Date, Date] | undefined>(props: ReadDateRangeProps<T>): Promise<T>
  }

export interface ReadDateRangeProps<T extends [Date, Date] | undefined> extends CommonReadProps<T, [Date, Date] | undefined>
  { defaultValue?: Date
  , hasTimeStart?: boolean
  , hasTimeEnd?: boolean
  , isRange: true
  }


// -----------------------

export interface ReadChoiceDropdown
  { <T extends F | undefined, F>(props: ReadChoiceDropdownGenericProps<T, F>): Promise<T>
    <T extends string | undefined>(props: ReadChoiceDropdownStringProps<T>): Promise<T>
    <T extends F[] | undefined, F>(props: ReadChoiceDropdownGenericMultipleProps<T, F>): Promise<T>
    <T extends string[] | undefined>(props: ReadChoiceDropdownStringMultipleProps<T>): Promise<T>
  }


export interface ReadChoiceDropdownGenericProps<T extends F | undefined, F> extends ReadChoiceListGenericProps<T, F>
  { isSearchable?: boolean }

export interface ReadChoiceDropdownStringProps<T extends string | undefined> extends ReadChoiceListStringProps<T>
  { isSearchable?: boolean }

export interface ReadChoiceDropdownGenericMultipleProps<T extends F[] | undefined, F> extends ReadChoiceListGenericMultipleProps<T, F>
  { isSearchable?: boolean }

export interface ReadChoiceDropdownStringMultipleProps<T extends string[] | undefined>extends ReadChoiceListStringMultipleProps<T>
  { isSearchable?: boolean }


// -----------------------

export interface ReadChoiceList
  { <T extends F | undefined, F>(props: ReadChoiceListGenericProps<T, F>): Promise<T>
    <T extends string | undefined>(props: ReadChoiceListStringProps<T>): Promise<T>
    <T extends F[] | undefined, F>(props: ReadChoiceListGenericMultipleProps<T, F>): Promise<T>
    <T extends string[] | undefined>(props: ReadChoiceListStringMultipleProps<T>): Promise<T>
  }

export interface ReadChoiceListGenericProps<T extends F | undefined, F> extends CommonReadProps<T, F | undefined>
  { options: F[]
  , valueProvider: (option: T) => string
  , labelProvider: (option: T) => string
  , defaultValue?: string
  , isMultiple?: false
  }

export interface ReadChoiceListStringProps<T extends string | undefined> extends CommonReadProps<T, string | undefined>
  { options: string[]
  , defaultValue?: string
  , isMultiple?: false
  }

export interface ReadChoiceListGenericMultipleProps<T extends F[] | undefined, F> extends CommonReadProps<T, F[] | undefined>
  { options: F[]
  , valueProvider: (option: T) => string
  , labelProvider: (option: T) => string
  , defaultValue?: string
  , isMultiple?: true
  }


export interface ReadChoiceListStringMultipleProps<T extends string[] | undefined> extends CommonReadProps<T, string[] | undefined>
  { options: string[]
  , defaultValue?: string
  , isMultiple?: true
  }




// -----------------------

export interface ReadStarRating
  { <T extends number>(props: ReadStarRatingProps<T>): Promise<T> }

export interface ReadStarRatingProps<T extends number | undefined> extends CommonReadProps<T, number | undefined> 
  { total?: number
  , defaultValue?: number }




// -----------------------

export interface ReadHappinessRating
  { <T extends number>(props: ReadHappinessRatingProps<T>): Promise<T> }

export interface ReadHappinessRatingProps<T extends number | undefined> extends CommonReadProps<T, number | undefined> 
  {}


// -----------------------

export interface ReadCheckbox
  { <T extends boolean>(props: ReadCheckboxProps<T>): Promise<T> }

export interface ReadCheckboxProps<T extends boolean> extends CommonReadProps<T, boolean> 
  { defaultValue?: boolean }


// -----------------------

export interface CommonReadProps<T extends U, U>
  { label: string
  , id: number | string
  , helpText?: string
  , guard?: 
    { checker:
        | ((result: U) => result is T)
        | ((result: U) => boolean)
    , errorProvider: (invalidResult: Exclude<U, T>) => string
    }
  }




// -----------------------

export interface WriteText
  { (props: WriteTextProps): Promise<void> }

export interface WriteTextProps
  { content: string
  , id: number | string
  , size?:
    | "display-large"
    | "display-medium"
    | "display-small"
    | "display-x-small"
    | "heading-xx-large"
    | "heading-x-large"
    | "heading-large"
    | "heading-medium"
    | "heading-small"
    | "heading-x-small"
    | "label-large"
    | "label-medium"
    | "label-small"
    | "label-x-small"
    | "paragraph-large"
    | "paragraph-medium"
    | "paragraph-small"
    | "paragraph-x-small"
  }


// -----------------------

export interface WriteSpace
  { (props: WriteSpaceProps): Promise<void> }

export interface WriteSpaceProps
  { id: number | string
  , size?:
    | "scale0"
    | "scale100"
    | "scale200"
    | "scale300"
    | "scale400"
    | "scale500"
    | "scale550"
    | "scale600"
    | "scale700"
    | "scale750"
    | "scale800"
    | "scale900"
    | "scale1000"
    | "scale1200"
    | "scale1400"
    | "scale1600"
    | "scale2400"
    | "scale3200"
    | "scale4800"
  }


export interface GuardHelper
  { required: <T>(label: string) =>
      { checker:
          | ((result: T | undefined) => result is T)
          | ((result: T | undefined) => boolean)
      , errorProvider: (invalidResult: undefined) => string
      }
  , pipe: GuardPipe
  }

export interface GuardPipe
  { <T0, T1 extends T0>
      ( g0: Guard<T0, T1>
      ): Guard<T0, T1>

    <T0, T1 extends T0, T2 extends T1>
      ( g0: Guard<T0, T1>
      , g1: Guard<T1, T2>
      ): Guard<T0, T2>

    <T0, T1 extends T0, T2 extends T1, T3 extends T2>
      ( g0: Guard<T0, T1>
      , g1: Guard<T1, T2>
      , g2: Guard<T2, T3>
      ): Guard<T0, T3>
    
    <T0, T1 extends T0, T2 extends T1, T3 extends T2, T4 extends T3>
      ( g0: Guard<T0, T1>
      , g1: Guard<T1, T2>
      , g2: Guard<T2, T3>
      , g3: Guard<T3, T4>
      ): Guard<T0, T4>
  }

interface Guard<T, U extends T>
  { checker:
    | ((result: T) => result is U)
    | ((result: T) => boolean)
  , errorProvider: (invalidResult: undefined) => string
  }