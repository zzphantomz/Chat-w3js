// @ts-ignore
export default function handler(req, res) {
  console.log('aaa', process.env.INFURA_KEY)
  res.status(200).json({
    name: 'Test',
    infura_id: process.env.INFURA_KEY,
    chain_id: process.env.CHAIN_ID,
    network_name: process.env.NETWORK_NAME,
  })
}
