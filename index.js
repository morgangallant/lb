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
const choose = () => machines[Math.floor(Math.random() * machines.length)]

/**
 * Handle an incoming request by routing it to one of the candidate machines. Since this balancer
 * is meant to handle requests from a variety of different hostnames, we write the true hostname
 * as a request header before assigning one of the candidate servers.
 * @param {*} req
 */
const handle = async req => {
  var url = new URL(req.url)
  url.hostname = choose()
  return fetch(url)
}

/**
 * Entry point to the load balancer.
 */
addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})
