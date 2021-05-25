import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {selectorFamily, useRecoilState, useRecoilValue} from 'recoil'
import {elementStateFamily, ElementStyle, selectedElementState} from './components/Rectangle/Rectangle'
import {Element} from './components/Rectangle/Rectangle'
import {get as _get, set as _set} from 'lodash'
import produce from 'immer'

const editPropertyState = selectorFamily<number | undefined, string>({
    key: 'editProperty',
    get:
        (path) =>
        ({get}) => {
            const selectedElementId = get(selectedElementState)
            if (selectedElementId === null) return

            const element = get(elementStateFamily(selectedElementId))
            return _get(element, path)
        },
    set:
        (path) =>
        ({get, set}, newValue) => {
            const selectedElementId = get(selectedElementState)

            if (selectedElementId === null) return

            const element = get(elementStateFamily(selectedElementId))

            // prevent lodash mutate the element object
            const newElement = produce(element, (draft) => {
                _set(draft, path, newValue)
            })

            set(elementStateFamily(selectedElementId), newElement)
        },
})

export const EditProperties = () => {
    const [top, setTop] = useRecoilState(editPropertyState('style.position.top'))

    if (!top) return null

    return (
        <Card>
            <Section heading="Position">
                <Property label="Top" value={top} onChange={(top) => setTop(top)} />
                {/* <Property
                    label="Left"
                    value={selectedElementProperties.style.position.left}
                    onChange={(left) => setPosition({property: 'left', value: left})}
                /> */}
            </Section>
            {/* <Section heading="Size">
                <Property
                    label="Width"
                    value={selectedElementProperties.style.size.width}
                    onChange={(width) => setPosition({property: 'width', value: width})}
                />
                <Property
                    label="Left"
                    value={selectedElementProperties.style.size.height}
                    onChange={(height) => setPosition({property: 'height', value: height})}
                />
            </Section> */}
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

const Property = ({label, value, onChange}: {label: string; value: number; onChange: (value: number) => void}) => {
    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => onChange(value)}>
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
