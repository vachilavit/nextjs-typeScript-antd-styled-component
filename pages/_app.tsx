import '../assets/less/global-styles.less'
import 'antd/dist/antd.less'
import '../assets/less/antd-custom.less'
import 'mobx-react-lite/batchingForReactDom'

import { AppProps } from 'next/app'
import styled, { ThemeProvider } from 'styled-components'
import { Layout } from 'antd'
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'
import { StyledTypographyTitle } from '../styled-components/Typography'

const { Header, Content } = Layout

const StyledHeader = styled(Header)({
    position: 'fixed',
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
})
const StyledContent = styled(Content)<{ $isDesktop?: boolean }>(({ $isDesktop }) => ({
    width: '100%',
    height: '100%',
    padding: $isDesktop ? '24px 16px 24px 16px' : '16px 8px 16px 8px',
    marginTop: 64,
    '&&&': {
        backgroundColor: '#fafafa',
    },
}))
const StyledLogo = styled(StyledTypographyTitle)({
    '&&&': { color: '#fff' },
})

const MyApp = ({ Component, pageProps }: AppProps) => {
    const breakpoint = useBreakpoint()
    return (
        <ThemeProvider theme={{}}>
            <Layout>
                <StyledHeader>
                    <StyledLogo level={2} styled={{ noGap: true }}>
                        Logo
                    </StyledLogo>
                </StyledHeader>
                <StyledContent $isDesktop={breakpoint.md}>
                    <Component {...pageProps} />
                </StyledContent>
            </Layout>
        </ThemeProvider>
    )
}

export default MyApp
