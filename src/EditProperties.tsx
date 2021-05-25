import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {selector, useRecoilState} from 'recoil'
import {Element, elementState, selectedElementState} from './components/Rectangle/Rectangle'

const selectedElementPropertiesSelector = selector<Element | undefined>({
    key: 'selectedElementProperties',
    get: ({get}) => {
        const selectedElementId = get(selectedElementState)

        if (selectedElementId === null) return

        return get(elementState(selectedElementId))
    },
    set: ({set, get}, newElement) => {
        const selectedElementId = get(selectedElementState)

        if (selectedElementId === null) return
        if (!newElement) return

        set(elementState(selectedElementId), newElement)
    },
})

type ElementProperty = 'top' | 'left' | 'width' | 'height'
export const EditProperties = () => {
    const [selectedElementProperties, setSelectedElementProperties] = useRecoilState(selectedElementPropertiesSelector)

    if (!selectedElementProperties) return null

    const setPosition = ({property, value}: {property: ElementProperty; value: number}) =>
        setSelectedElementProperties(
            (prevElement) =>
                prevElement && {
                    ...prevElement,
                    style: {
                        ...prevElement?.style,
                        ...((property === 'top' || property === 'left') && {
                            position: {
                                ...prevElement?.style.position,
                                [property]: value,
                            },
                        }),
                        ...((property === 'width' || property === 'height') && {
                            size: {
                                ...prevElement?.style.size,
                                [property]: value,
                            },
                        }),
                    },
                },
        )

    return (
        <Card>
            <Section heading="Position">
                <Property
                    label="Top"
                    value={selectedElementProperties.style.position.top}
                    onChange={(top) => setPosition({property: 'top', value: top})}
                />
                <Property
                    label="Left"
                    value={selectedElementProperties.style.position.left}
                    onChange={(left) => setPosition({property: 'left', value: left})}
                />
            </Section>
            <Section heading="Size">
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
            </Section>
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
