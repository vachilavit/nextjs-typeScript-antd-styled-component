import styled from 'styled-components'
import { Typography } from 'antd'

const { Title } = Typography

export const StyledTypographyTitle = styled(Title)<{
    styled?: { noGap?: boolean; textAlign?: React.CSSProperties['textAlign'] }
}>(({ styled }) => {
    if (styled) {
        return {
            '&&&': { marginBottom: styled.noGap ? 0 : undefined, textAlign: styled.textAlign },
        }
    }
})

export default Title
