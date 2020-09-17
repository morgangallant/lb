/**
 * The set of machines that are capable of serving user requests.
 */
const machines = [
  'dell0.morgangallant.com',
  'dell1.morgangallant.com',
  'dell2.morgangallant.com',
]

/**
 * Returns a machine at random for a given request.
 */
const chooseMachine = () =>
  machines[Math.floor(Math.random() * machines.length)]

/**
 * Modify an incoming request object to re-route it to one of our machines, and update some of its
 * parameters. We pass the true hostname of the initial request as an X-Hostname header.
 * @param {*} req
 */
const modifyRequest = req => {
  var url = new URL(req.url)
  url.hostname = chooseMachine()
  return new Request(
    url.toString(),
    new Request(req, {
      headers: {
        'X-Hostname': req.url,
      },
    }),
  )
}

/**
 * Handle an incoming request by routing it to one of the candidate machines. Since this balancer
 * is meant to handle requests from a variety of different hostnames, we write the true hostname
 * as a request header before assigning one of the candidate servers.
 * @param {*} req
 */
const handle = async req => {
  return fetch(modifyRequest(req))
}

/**
 * Entry point to the load balancer.
 */
addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})
