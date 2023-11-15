export default function room({ params }: { params: { room: string } }) {
    return ( <main> <h1>room: {params.room}</h1></main> )
}