import {Container, Heading, Text} from '@chakra-ui/layout'
import {Select} from '@chakra-ui/select'
import {Suspense, useState} from 'react'
import {atomFamily, selectorFamily, useRecoilValue, useSetRecoilState} from 'recoil'
import {getWeather} from './fakeAPI'

const userState = selectorFamily({
    key: 'user',
    get: (userId: number) => async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        const userData = await res.json()
        return userData
    },
})

// 1. 建立 weatherRequestId
const weatherRequestIdState = atomFamily({
    key: 'weatherRequestId',
    default: 0,
})
const useRefetchWeather = (userId: number) => {
    const setRequestId = useSetRecoilState(weatherRequestIdState(userId))
    return () => setRequestId((id) => id + 1)
}

const weatherState = selectorFamily({
    key: 'weather',
    get:
        (userId: number) =>
        async ({get}) => {
            // 3. 由於 weatherState 相依於 weatherRequestId，因此一旦此值改變，recoil 就會再次執行此 selector 中的 get function
            get(weatherRequestIdState(userId))

            const user = get(userState(userId)) // 這裡並不需要加上 await，recoil 會在取得 userState 後才接著執行這裡的 get function
            const weather = await getWeather(user.address.city)
            return weather
        },
})

const WeatherDate = ({userId}: {userId: number}) => {
    const user = useRecoilValue(userState(userId))
    const weather = useRecoilValue(weatherState(userId))

    // 2. 使用者呼叫此 function 時，weatherRequestId 會改變
    const refetch = useRefetchWeather(userId)

    return (
        <div>
            <Text>
                <b>Weather for {user.address.city}:</b> {weather}°C
            </Text>
            <Text onClick={refetch}>(refresh weather)</Text>
        </div>
    )
}

const UserData = ({userId}: {userId: number}) => {
    const user = useRecoilValue(userState(userId))

    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                User data:
            </Heading>
            <Text>
                <b>Name:</b> {user.name}
            </Text>
            <Suspense fallback={<div>Loading weather...</div>}>
                <WeatherDate userId={userId} />
            </Suspense>
        </div>
    )
}

export const Async = () => {
    const [userId, setUserId] = useState<number>()

    return (
        <Container py={10}>
            <Heading as="h1" mb={4}>
                View Profile
            </Heading>
            <Heading as="h2" size="md" mb={1}>
                Choose a user:
            </Heading>
            <Select
                placeholder="Choose a user"
                mb={4}
                value={userId}
                onChange={(event) => {
                    const value = event.target.value
                    setUserId(value ? parseInt(value) : undefined)
                }}
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
            </Select>
            {userId !== undefined && (
                // Suspense 會在 UserData 中的所有 data 都 resolve 後才解開
                <Suspense fallback={<div>Loading...</div>}>
                    <UserData userId={userId} />
                </Suspense>
            )}
        </Container>
    )
}
