const baseJp = "https://jsonplaceholder.typicode.com";

export default async function Jp() {
  const data = await fetch(`${baseJp}/posts`).then((res) => res.json());

  return (
    <div>
      <div className="container">
        <h1>Jsonplaceholder</h1>
        <div>
          {data.map((item: { title: string; body: string }, i: number) => (
            <div key={i}>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
