/// <reference types="next" />
/// <reference types="next/types/global" />

import { CSSProp } from 'styled-components'

declare module 'styled-components' {
    export interface DefaultTheme {}
}

declare module 'react' {
    interface Attributes {
        css?: CSSProp
    }
}
