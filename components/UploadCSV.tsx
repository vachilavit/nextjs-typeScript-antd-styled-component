import React, { useRef, useImperativeHandle } from 'react'
import { observer, useLocalStore } from 'mobx-react-lite'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Row, Col, Typography } from 'antd'
import styled from 'styled-components'
import { runInAction } from 'mobx'
import Papa from 'papaparse'

const { Text } = Typography

type InputRef = React.MutableRefObject<HTMLInputElement | null> | ((instance: HTMLInputElement | null) => void) | null
type UseUploadCSVProps<CSVResult> = {
    ref: InputRef
    validateFile?: (results: Papa.ParseResult<CSVResult>) => boolean
    onChange: (results: Papa.ParseResult<CSVResult>, file?: File) => void
}
type ReturnTypeHooks = ReturnType<typeof useUploadCSV>
function useUploadCSV<CSVResult>({ ref, validateFile, onChange }: UseUploadCSVProps<CSVResult>) {
    const uploadRef = useRef<HTMLInputElement | null>(null)
    const state = useLocalStore(() => ({
        fileName: undefined as string | undefined,
        onUploadChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value, files } = e.target
            const file = files?.[0]
            const fileExt = value.substring(value.lastIndexOf('.'))

            if (file && fileExt === '.csv') {
                new Promise((resolve, reject) => {
                    Papa.parse<CSVResult>(file, {
                        complete: (results, file) => {
                            if (typeof validateFile === 'undefined' || validateFile(results)) {
                                onChange(results, file)

                                resolve()
                            }
                        },
                        error: (error) => {
                            console.error(error)
                            if (uploadRef.current) {
                                uploadRef.current.value = ''
                            }
                        },
                        worker: true,
                        header: true,
                        dynamicTyping: true,
                    })
                }).then(() => {
                    runInAction(() => {
                        state.fileName = file?.name
                    })
                })
            } else {
                if (uploadRef.current) {
                    uploadRef.current.value = ''
                }
            }
        },
    }))

    useImperativeHandle(ref, () => uploadRef.current as HTMLInputElement)

    return { state, uploadRef }
}

const StyledButtonUpload = styled(Button)(() => ({
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    '&.ant-btn-icon-only > *': {
        fontSize: 35,
    },
}))

type UploadCSVViewProps = {} & ReturnTypeHooks
let UploadCSVView: React.FC<UploadCSVViewProps> = ({ state, uploadRef }) => {
    return (
        <Row gutter={[16, 0]}>
            <Col>
                <StyledButtonUpload
                    type='text'
                    icon={<UploadOutlined />}
                    onClick={() => {
                        uploadRef.current?.click()
                    }}
                />
                <input
                    ref={uploadRef}
                    type='file'
                    accept='.csv'
                    onChange={state.onUploadChange}
                    css={{ display: 'none' }}
                />
            </Col>
            <Row>
                <Col span={24}>
                    <Text css={{ fontWeight: 700 }}>vis CSV file</Text>
                </Col>
                <Col span={24}>{state.fileName || 'อัปเดตข้อมูลจากไฟล์ CSV'}</Col>
            </Row>
        </Row>
    )
}
UploadCSVView = observer(UploadCSVView)

// type UploadCSVProps = UseUploadCSVProps & Omit<UploadCSVViewProps, keyof ReturnTypeHooks>
// let UploadCSV = React.forwardRef<HTMLInputElement, UploadCSVProps>(({ onChange, ...others }, ref) => {
//     const uploadCSV = useUploadCSV({ ref, onChange })
//     return <UploadCSVView {...uploadCSV} {...others} />
// })
// type UploadCSVProps = UseUploadCSVProps & Omit<UploadCSVViewProps, keyof ReturnTypeHooks>
// let UploadCSV = observer<UploadCSVProps, HTMLInputElement>(
//     ({ validateFile, onChange, ...others }, ref) => {
//         const uploadCSV = useUploadCSV({ ref, validateFile, onChange })
//         return <UploadCSVView {...uploadCSV} {...others} />
//     },
//     { forwardRef: true },
// )
type UploadCSVProps<CSVResult> = UseUploadCSVProps<CSVResult> & Omit<UploadCSVViewProps, keyof ReturnTypeHooks>
let UploadCSV = <CSVResult,>({ validateFile, onChange, ...others }: UploadCSVProps<CSVResult>, ref: InputRef) => {
    const uploadCSV = useUploadCSV<CSVResult>({ ref, validateFile, onChange })
    return <UploadCSVView {...uploadCSV} {...others} />
}
UploadCSV = observer(UploadCSV, { forwardRef: true })

export default UploadCSV
