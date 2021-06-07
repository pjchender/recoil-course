import {Box, Text, VStack} from '@chakra-ui/layout'
import {Skeleton} from '@chakra-ui/skeleton'
import {selector, useRecoilValue} from 'recoil'
import {callApi} from '../api'
import {elementStateFamily, selectedElementState} from './Rectangle/Rectangle'

interface IImageInfo {
    author: string
    download_url: string
    height: number
    id: string
    url: string
    width: number
}

export const Info = ({label, value}: {label: string; value?: string}) => {
    return (
        <Box width="175px">
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
                foo
            </Text>
            {value === undefined ? <Skeleton width="100%" height="21px" /> : <Text fontSize="14px">{value}</Text>}
        </Box>
    )
}

/**
 * imageIdState 是 intermediate selector，目的是讓 imageInfoState 相依到的是 imageIdState
 */
const imageIdState = selector({
    key: 'imageId',
    get: ({get}) => {
        const elementId = get(selectedElementState)
        if (elementId === null) return

        const element = get(elementStateFamily(elementId))
        return element.image?.id
    },
})

// imageInfoState 會在 imageIdState 回傳的值「有改變時」才會觸發
const imageInfoState = selector({
    key: 'imageInfo',
    get: ({get}) => {
        const imageId = get(imageIdState)
        if (imageId === undefined) return

        return callApi<IImageInfo>('image-details', {queryParams: {seed: imageId}})
    },
})

export const ImageInfo = () => {
    const imageInfo = useRecoilValue(imageInfoState)

    if (imageInfo === undefined) return null

    return (
        <VStack spacing={2} alignItems="flex-start" width="100%">
            <Info label="Author" value={imageInfo.author} />
            <Info label="Image URL" value={imageInfo.url} />
        </VStack>
    )
}

export const ImageInfoFallback = () => {
    return (
        <VStack spacing={2} alignItems="flex-start" width="100%">
            <Info label="Author" />
            <Info label="Image URL" />
        </VStack>
    )
}
