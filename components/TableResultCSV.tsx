import React, { useState, useCallback } from 'react'
import { observer, useLocalStore } from 'mobx-react-lite'
import { Table, Tag, Menu, Dropdown, Button } from 'antd'
import styled from 'styled-components'
import { ColumnsType } from 'antd/lib/table'
import * as palettes from '@ant-design/colors'
import isNil from 'lodash/isNil'
import { TagProps } from 'antd/lib/tag'
import { CaretDownOutlined } from '@ant-design/icons'

const { ItemGroup, Item } = Menu

enum ColumnDataIndex {
    ROW_NUMBER,
    CONDO_NAME = 'condo_name-EN',
    RENT_PRICE = 'rent_price',
    SELL_PRICE = 'sale_price',
    BEDROOM = 'bedroom',
    BATHROOM = 'bath',
    SIZE = 'size (sq.m)',
    FLOOR = 'floor',
    STATUS = 'status',
    TITLE = 'title',
    DESCRIPTION = 'description',
    PHOTO = 'photo1',
    AMENITIES = 'amenities',
}

type PrepareDataCSV = ColumnRecordCSV & {
    status: string[]
    amenities: string[]
}

const validateRecord = (value: any, record: ColumnRecordCSV, index: number) => {
    if (
        [ColumnDataIndex.RENT_PRICE, ColumnDataIndex.SELL_PRICE].every((columnKey) => {
            //@ts-ignore
            return isNil(record[columnKey])
        })
    ) {
        return false
    }

    return [
        ColumnDataIndex.CONDO_NAME,
        ColumnDataIndex.BEDROOM,
        ColumnDataIndex.BATHROOM,
        ColumnDataIndex.SIZE,
        ColumnDataIndex.FLOOR,
        ColumnDataIndex.TITLE,
        ColumnDataIndex.DESCRIPTION,
    ].every((columnKey) => {
        //@ts-ignore
        return !isNil(record[columnKey])
    })
}

const renderCheckNotfound = (value: any) => {
    return value ?? <StyledTextNotfound>not found</StyledTextNotfound>
}

let renderPhoto = (value: any, record: ColumnRecordCSV, index: number) => {
    const [isHover, setHover] = useState(false)
    const onMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setHover(true)
    }, [])
    const onMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setHover(false)
    }, [])

    return (
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <StyledImageThumbnail
                src={value}
                alt={value}
                onError={(e) => {
                    //@ts-ignore
                    e.target.style.display = 'none'
                }}
            />
            {isHover && (
                <Button type='text' css={{ marginLeft: 8, color: palettes.blue.primary }}>
                    Edit photo
                </Button>
            )}
        </div>
    )
}

const renderAmenities = (value: PrepareDataCSV['amenities']) => {
    return (
        <Menu>
            <ItemGroup
                title='Amenities'
                css={{
                    '& .ant-dropdown-menu-item-group-title': {
                        color: 'black',
                        fontWeight: 600,
                        borderBottom: `3px solid ${palettes.blue.primary}`,
                    },
                    '& .ant-dropdown-menu-item-group-list': { margin: 8 },
                }}
            >
                {value.map((text) => (
                    <Item
                        key={text}
                        css={{
                            '&&&': { cursor: 'default' },
                            '& .ant-dropdown-menu-item': {
                                backgroundColor: '#fff',
                                paddingLeft: 0,
                                paddingRight: 0,
                            },
                        }}
                    >
                        {text}
                    </Item>
                ))}
            </ItemGroup>
        </Menu>
    )
}

type UseTableResultCSVProps = { resultCSV?: Papa.ParseResult<ColumnRecordCSV> }
type ReturnTypeHooks = ReturnType<typeof useTableResultCSV>
const useTableResultCSV = (props: UseTableResultCSVProps) => {
    const state = useLocalStore(
        (source) => ({
            get prepareDataCSV(): PrepareDataCSV[] | undefined {
                return source.resultCSV?.data.map<PrepareDataCSV>((item) => {
                    let status: string[] = []
                    if (item.agent_post) status.push('Agent post')
                    if (item.accept_agent) status.push('รับ Co-Agent')

                    let amenities: string[] = []
                    if (item.Aircon) amenities.push('Aircon')
                    if (item['Bath tub']) amenities.push('Bath tub')
                    if (item['Electric stove']) amenities.push('Electric stove')
                    if (item.Furniture) amenities.push('Furniture')
                    if (item['Gas stove']) amenities.push('Gas stove')
                    if (item.Refrigerator) amenities.push('Refrigerator')
                    if (item['Washing machine']) amenities.push('Washing machine')
                    if (item['Water heater']) amenities.push('Water heater')

                    return {
                        ...item,
                        status,
                        amenities,
                    }
                })
            },
        }),
        props,
    )

    const columns: ColumnsType<ColumnRecordCSV> = [
        {
            title: undefined,
            key: ColumnDataIndex.ROW_NUMBER,
            width: 50,
            align: 'center',
            render: (value, record, index) => (
                <StyledTextOrder $error={!validateRecord(value, record, index)}>{index + 1}</StyledTextOrder>
            ),
        },
        {
            title: 'CONDO NAME',
            dataIndex: ColumnDataIndex.CONDO_NAME,
            key: ColumnDataIndex.CONDO_NAME,
            width: 400,
            ellipsis: true,
            render: renderCheckNotfound,
        },
        {
            title: 'RENT PRICE (Baht)',
            dataIndex: ColumnDataIndex.RENT_PRICE,
            key: ColumnDataIndex.RENT_PRICE,
            width: 200,
            render: (text) =>
                text ? (
                    <div>
                        {text}
                        <span css={{ color: 'rgba(0, 0, 0, 0.3)' }}>/month</span>
                    </div>
                ) : undefined,
        },
        {
            title: 'SELL PRICE (Baht)',
            dataIndex: ColumnDataIndex.SELL_PRICE,
            key: ColumnDataIndex.SELL_PRICE,
            width: 200,
            render: (text) => (text ? text : undefined),
        },
        {
            title: 'BEDROOM',
            dataIndex: ColumnDataIndex.BEDROOM,
            key: ColumnDataIndex.BEDROOM,
            width: 100,
            render: (value) => (value === 0 ? 'Studio' : value) ?? <StyledTextNotfound>not found</StyledTextNotfound>,
        },
        {
            title: 'BATHROOM',
            dataIndex: ColumnDataIndex.BATHROOM,
            key: ColumnDataIndex.BATHROOM,
            width: 100,
            render: renderCheckNotfound,
        },
        {
            title: 'SIZE (sqm.)',
            dataIndex: ColumnDataIndex.SIZE,
            key: ColumnDataIndex.SIZE,
            width: 100,
            render: renderCheckNotfound,
        },
        {
            title: 'FLOOR',
            dataIndex: ColumnDataIndex.FLOOR,
            key: ColumnDataIndex.FLOOR,
            width: 100,
            render: renderCheckNotfound,
        },
        {
            title: 'STATUS',
            dataIndex: ColumnDataIndex.STATUS,
            key: ColumnDataIndex.STATUS,
            width: 300,
            render: (tags: string[]) =>
                tags.map((tag) => {
                    let color: TagProps['color']
                    if (tag === 'Agent post') {
                        color = 'green'
                    } else {
                        color = 'gold'
                    }
                    return (
                        <StyledTag key={tag} color={color}>
                            {tag}
                        </StyledTag>
                    )
                }),
        },
        {
            title: 'PHOTO',
            dataIndex: ColumnDataIndex.PHOTO,
            key: ColumnDataIndex.PHOTO,
            width: 300,
            render: renderPhoto,
        },
        {
            title: 'TITLE',
            dataIndex: ColumnDataIndex.TITLE,
            key: ColumnDataIndex.TITLE,
            width: 300,
            ellipsis: true,
            render: renderCheckNotfound,
        },
        {
            title: 'DESCRIPTION',
            dataIndex: ColumnDataIndex.DESCRIPTION,
            key: ColumnDataIndex.DESCRIPTION,
            width: 300,
            ellipsis: true,
            render: renderCheckNotfound,
        },
        {
            title: 'Amenities',
            dataIndex: ColumnDataIndex.AMENITIES,
            key: ColumnDataIndex.AMENITIES,
            width: 100,
            render: (value: PrepareDataCSV['amenities']) => (
                <span>
                    {value.length}{' '}
                    <Dropdown overlay={renderAmenities(value)} disabled={value.length === 0}>
                        <CaretDownOutlined />
                    </Dropdown>
                </span>
            ),
        },
    ]

    return {
        state,
        columns,
        dataSource: state.prepareDataCSV?.map((item, index) => ({ key: index, ...item })),
    }
}

const StyledTag = styled(Tag)(() => ({
    '&.ant-tag': {
        border: 'none',
        borderRadius: 8,
        padding: 8,
    },
}))

const StyledTextOrder = styled.span(({ $error }: { $error: boolean }) => {
    let styleError: React.CSSProperties = {}
    if ($error) {
        styleError = { color: '#fff', backgroundColor: palettes.red.primary, borderRadius: 8, margin: -8, padding: 8 }
    }
    return {
        color: 'rgba(0, 0, 0, 0.3)',
        ...styleError,
    }
})

const StyledImageThumbnail = styled.img(() => ({
    borderRadius: 8,
    width: 34,
    height: 34,
}))

const StyledTextNotfound = styled.span(() => ({
    color: palettes.red.primary,
}))

const StyledTable = styled(Table)({
    '& .ant-table': {
        color: 'rgba(0, 0, 0, 1)',
        fontWeight: 500,
    },
    '& .ant-table-thead > tr > th': {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: '0.85em',
        fontWeigh: 700,
    },
})

type TableResultCSVViewProps = {} & ReturnTypeHooks
let TableResultCSVView: React.FC<TableResultCSVViewProps> = ({ columns, dataSource }) => {
    return <StyledTable columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: '100%', y: 682 }} />
}
TableResultCSVView = observer(TableResultCSVView)

type TableResultCSVProps = UseTableResultCSVProps & Omit<TableResultCSVViewProps, keyof ReturnTypeHooks>
let TableResultCSV: React.FC<TableResultCSVProps> = ({ resultCSV, ...others }) => {
    const tableResultCSV = useTableResultCSV({ resultCSV })
    return <TableResultCSVView {...tableResultCSV} {...others} />
}
TableResultCSV = observer(TableResultCSV)

export default TableResultCSV
