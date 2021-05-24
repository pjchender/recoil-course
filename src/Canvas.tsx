import {useRecoilValue, useSetRecoilState} from 'recoil'
import {Rectangle, selectedElementState} from './components/Rectangle/Rectangle'
import {PageContainer} from './PageContainer'
import {Toolbar, elementsState} from './Toolbar'

function Canvas() {
    const setSelectedElement = useSetRecoilState(selectedElementState)
    const elements = useRecoilValue(elementsState)

    return (
        <PageContainer
            onClick={() => {
                setSelectedElement(null)
            }}
        >
            <Toolbar />
            {elements.map((id) => (
                <Rectangle key={id} id={id} />
            ))}
        </PageContainer>
    )
}

export default Canvas
