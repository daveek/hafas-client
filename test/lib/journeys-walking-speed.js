'use strict'

const isRoughlyEqual = require('is-roughly-equal')

const testJourneysWalkingSpeed = async (cfg) => {
	const {test: t, journeys, validate, from, to, products, difference: dT} = cfg

	const {journeys: journeysWithFastWalking} = await journeys(from, to, {
		results: 1, products, walkingSpeed: 'fast'
	})
	const legWithFastWalking = journeysWithFastWalking[0].legs.find(l => l.walking)
	t.ok(legWithFastWalking, 'no walking leg in journey with fast walking')

	const {journeys: journeysWithSlowWalking} = await journeys(from, to, {
		results: 1, products, walkingSpeed: 'slow'
	})
	const legWithSlowWalking = journeysWithSlowWalking[0].legs.find(l => l.walking)
	t.ok(legWithSlowWalking, 'no walking leg in journey with slow walking')

	const fastDist = legWithFastWalking.distance
	const slowDist = legWithSlowWalking.distance
	t.ok(isRoughlyEqual(100, fastDist, slowDist), 'precondition failed')
	const fastDur = new Date(legWithFastWalking.arrival) - new Date(legWithFastWalking.departure)
	const slowDur = new Date(legWithSlowWalking.arrival) - new Date(legWithSlowWalking.departure)
	t.notOk(isRoughlyEqual(dT, fastDur, slowDur), 'walkingSpeed not applied')
	t.end()
}

module.exports = testJourneysWalkingSpeed