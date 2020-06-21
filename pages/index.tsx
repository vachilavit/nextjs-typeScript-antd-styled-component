import React, { useRef } from 'react'
import { observer, useLocalStore } from 'mobx-react-lite'
import { runInAction } from 'mobx'
import { Row, Col, Card, Typography, Button } from 'antd'
import * as palettes from '@ant-design/colors'
import UploadCSV from '../components/UploadCSV'
import styled from 'styled-components'
import { StyledTypographyTitle } from '../styled-components/Typography'
import { HistoryOutlined, FileAddOutlined } from '@ant-design/icons'
import TableResultCSV from '../components/TableResultCSV'
import isEqual from 'lodash/isEqual'

const { Title } = Typography

type UseIndexProps = {}
type ReturnTypeHooks = ReturnType<typeof useIndex>
const useIndex = (props: UseIndexProps) => {
    const uploadRef = useRef<HTMLInputElement | null>(null)
    const state = useLocalStore(() => ({
        uploadResult: undefined as Papa.ParseResult<ColumnRecordCSV> | undefined,
        onUploadChange: (results: Papa.ParseResult<ColumnRecordCSV>, file?: File) => {
            runInAction(() => {
                state.uploadResult = results
            })
        },
    }))
    return { state, uploadRef }
}

const StyledPaper = styled.div(() => ({
    padding: 24,
    border: '1px solid #f0f0f0',
    backgroundColor: '#fff',
}))

type IndexViewProps = {} & ReturnTypeHooks
let IndexView: React.FC<IndexViewProps> = ({ state, uploadRef }) => {
    return (
        <Row justify='center' gutter={[0, 24]}>
            {/* input upload */}
            <Col xs={24} sm={21} md={18} lg={15} xl={12} xxl={9}>
                <Card
                    title={
                        <StyledTypographyTitle level={4} styled={{ noGap: true }}>
                            Bulk Upload form
                        </StyledTypographyTitle>
                    }
                >
                    <Title level={4}>Choose your an input method</Title>

                    <StyledPaper>
                        <UploadCSV<ColumnRecordCSV>
                            ref={uploadRef}
                            validateFile={(results) =>
                                isEqual(results.meta.fields, [
                                    'id',
                                    'condo_name-EN',
                                    'rent_price',
                                    'sale_price',
                                    'bedroom',
                                    'bath',
                                    'size (sq.m)',
                                    'floor',
                                    'agent_post',
                                    'accept_agent',
                                    'title',
                                    'description',
                                    'photo1',
                                    'Aircon',
                                    'Bath tub',
                                    'Electric stove',
                                    'Furniture',
                                    'Gas stove',
                                    'Refrigerator',
                                    'Washing machine',
                                    'Water heater',
                                ])
                            }
                            onChange={state.onUploadChange}
                        />
                    </StyledPaper>
                </Card>
            </Col>

            <Col span={24}>
                {/* overview + action */}
                <StyledPaper css={{ paddingLeft: 0 }}>
                    <Row>
                        <Col
                            flex='72px'
                            css={{
                                marginTop: -24,
                                marginBottom: -24,
                                marginRight: 16,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.05)',
                            }}
                        >
                            <StyledTypographyTitle
                                title={state.uploadResult?.data.length.toString()}
                                level={4}
                                ellipsis
                                styled={{ noGap: true, textAlign: 'center' }}
                                css={{ maxWidth: 72 }}
                            >
                                {state.uploadResult?.data.length || 0}
                            </StyledTypographyTitle>
                        </Col>

                        <Col flex='1' css={{ minWidth: 0 }}>
                            <StyledTypographyTitle
                                title='listings successfully and Ready to published'
                                level={4}
                                ellipsis
                                styled={{ noGap: true }}
                                css={{ maxWidth: 396 }}
                            >
                                listings successfully and Ready to published
                            </StyledTypographyTitle>
                        </Col>

                        <Col>
                            <Button
                                type='text'
                                css={{ color: palettes.blue.primary }}
                                onClick={() => {
                                    uploadRef.current?.click()
                                }}
                            >
                                <HistoryOutlined />
                                Update data
                            </Button>
                        </Col>

                        <Col>
                            <Button type='text' disabled css={{ color: palettes.green.primary }}>
                                <FileAddOutlined />
                                Published
                            </Button>
                        </Col>
                    </Row>
                </StyledPaper>

                {/* table */}
                <TableResultCSV resultCSV={state.uploadResult} />
            </Col>
        </Row>
    )
}
IndexView = observer(IndexView)

type IndexProps = UseIndexProps & Omit<IndexViewProps, keyof ReturnTypeHooks>
let Index: React.FC<IndexProps> = ({ ...others }) => {
    const index = useIndex({})
    return <IndexView {...index} {...others} />
}
Index = observer(Index)

export default Index
