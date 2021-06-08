import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {selector, selectorFamily, useRecoilState, useRecoilValue} from 'recoil'
import {elementStateFamily, selectedElementState} from './components/Rectangle/Rectangle'
import {get as _get, set as _set} from 'lodash'
import produce from 'immer'
import {ImageInfo, ImageInfoFallback} from './components/ImageInfo'
import {Suspense} from 'react'

type Size = {
    width: number
    height: number
}
type Position = {
    top: number
    left: number
}
type EditPropertyType = number | Size | Position
export const editPropertyState = selectorFamily<EditPropertyType, {path: string; id: number}>({
    key: 'editProperty',
    get:
        ({path, id}) =>
        ({get}) => {
            const element = get(elementStateFamily(id))
            return _get(element, path) as number
        },
    set:
        ({path, id}) =>
        ({get, set}, newValue) => {
            const element = get(elementStateFamily(id))

            // prevent lodash mutate the element object
            const newElement = produce(element, (draft) => {
                _set(draft, path, newValue)
            })

            set(elementStateFamily(id), newElement)
        },
})

type EditSizeType = {
    dimension: 'width' | 'height'
    id: number
}

function assertIsSize(editProperty: EditPropertyType): asserts editProperty is Size {
    if (typeof editProperty === 'number') throw new Error('not Size type')
    if ('top' in editProperty) throw new Error('not Size type')
    if ('left' in editProperty) throw new Error('not Size type')
}
const editSize = selectorFamily<any, EditSizeType>({
    key: 'editSize',
    get:
        ({dimension, id}) =>
        ({get}) => {
            return get(editPropertyState({path: `style.size.${dimension}`, id}))
        },
    set:
        ({dimension, id}) =>
        ({get, set}, newValue) => {
            const size = editPropertyState({path: 'style.size', id})
            const propertyState = get(size)
            assertIsSize(propertyState)

            const aspectRadio = propertyState.width / propertyState.height
            if (dimension === 'width') {
                set(size, {
                    width: newValue,
                    height: newValue / aspectRadio,
                })
            } else {
                set(size, {
                    width: newValue * aspectRadio,
                    height: newValue,
                })
            }
        },
})

const hasImageState = selector({
    key: 'hasImage',
    get: ({get}) => {
        const elementId = get(selectedElementState)
        if (elementId === null) return

        const element = get(elementStateFamily(elementId))
        return element.image !== undefined
    },
})

export const EditProperties = () => {
    const selectedElementId = useRecoilValue(selectedElementState)
    const hasImage = useRecoilValue(hasImageState)

    if (selectedElementId === null) return null

    return (
        <Card>
            <Section heading="Position">
                <Property label="Top" path="style.position.top" id={selectedElementId} />
                <Property label="Left" path="style.position.left" id={selectedElementId} />
            </Section>
            <Section heading="Size">
                <Property label="Width" path="style.size.width" id={selectedElementId} />
                <Property label="Height" path="style.size.height" id={selectedElementId} />
            </Section>
            {hasImage && (
                <Section heading="Image">
                    <Suspense fallback={<ImageInfoFallback />}>
                        <ImageInfo />
                    </Suspense>
                </Section>
            )}
        </Card>
    )
}

const Section: React.FC<{heading: string}> = ({heading, children}) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight="500">{heading}</Text>
            {children}
        </VStack>
    )
}

const Property = ({label, path, id}: {label: string; path: string; id: number}) => {
    const [value, setValue] = useRecoilState(editPropertyState({path, id}))

    if (!value) return null

    if (typeof value !== 'number') return null

    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => setValue(value)}>
                    <NumberInputField borderRadius="md" />
                    <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
                </NumberInput>
            </InputGroup>
        </div>
    )
}

const Card: React.FC = ({children}) => (
    <VStack
        position="absolute"
        top="20px"
        right="20px"
        backgroundColor="white"
        padding={2}
        boxShadow="md"
        borderRadius="md"
        spacing={3}
        align="flex-start"
        onClick={(e) => e.stopPropagation()}
    >
        {children}
    </VStack>
)
