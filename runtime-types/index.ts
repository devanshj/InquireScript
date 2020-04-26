export type Main =
	(runtime: Runtime) => Promise<string[] | void>

export type Runtime = 
  { readText: <T extends string>(props: ReadTextProps<T>) => Promise<T>
  , readNumber: <T extends number>(props: ReadNumberProps<T>) => Promise<T>
  , readDate: <T extends Date>(props: ReadDateProps<T>) => Promise<T>
  , readDateRange: <T extends [Date, Date]>(props: ReadDateRangeProps<T>) => Promise<T>
  , readChoiceDropdown: <T, U extends T>(props: ReadChoiceDropdownProps<T, U>) => Promise<U>
  , readChoiceList: <T, U extends T>(props: ReadChoiceListProps<T, U>) => Promise<U>
  , readStarRating: <T extends number>(props: ReadStarRatingProps<T>) => Promise<T>
  , readHappinessRating: <T extends number>(props: ReadHappinessRatingProps<T>) => Promise<T>
  , readCheckbox: <T extends boolean>(props: ReadCheckboxProps<T>) => Promise<T>
  , writeText: (props: WriteTextProps) => Promise<void>
  , writeSpace: (props: WriteSpaceProps) => Promise<void>
  }

export type ReadTextProps<T extends string> =
  & { defaultValue?: string
    , type?: "email" | "password"
    }
  & CommonReadProps<string, T>

export type ReadMaskedTextProps<T extends string> =
  & { defaultValue?: string
    , mask: string
    }
  & CommonReadProps<string, T>


export type ReadNumberProps<T extends number> =
  & { defaultValue?: number }
  & CommonReadProps<number, T>

export type ReadDateProps<T extends Date> =
  & { defaultValue?: Date
    , min?: Date
    , max?: Date
    , hasTime?: boolean
    }
  & CommonReadProps<Date, T>

export type ReadDateRangeProps<T extends [Date, Date]> =
  & { defaultValue?: Date
    , min?: Date
    , max?: Date
    , hasTimeStart?: boolean
    , hasTimeEnd?: boolean
    }
  & CommonReadProps<[Date, Date], T>

export type ReadChoiceDropdownProps<T, U extends T> = 
  & { options: T[] // (todo feature) | Promise<T[]>
    , labelProvider: (option: T) => string
    , valueProvider: (option: T) => string
    , isSearchable?: boolean
    , defaultValue?: T 
    }
  & CommonReadProps<T, U>

export type ReadChoiceListProps<T, U extends T> = 
  & { options: T[] // (todo feature) | Promise<T[]>
    , labelProvider: (option: T) => string
    , valueProvider: (option: T) => string
    , defaultOption?: T
    }
  & CommonReadProps<T, U>

export type ReadStarRatingProps<T extends number> =
  & { total?: number }
  & CommonReadProps<number, T>

export type ReadHappinessRatingProps<T extends number> =
  & {}
  & CommonReadProps<number, T>

export type ReadCheckboxProps<T extends boolean> =
  { defaultValue?: boolean
  }
  & CommonReadProps<boolean, T>

export type CommonReadProps<T, U extends T> =
  { label: string
  , id: number | string
  , helpText?: string 
  , guard?:
      { checker:
          | ((result: T) => result is U)
          | ((result: T) => boolean)
      , errorProvider: (invalidResult: Exclude<T, U>) => string
      }
  }

export type WriteTextProps =
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

type WriteSpaceProps = 
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