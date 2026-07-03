package gg.felo.tanken

import gg.felo.tanken.model.HistoryLocationsResponse
import gg.felo.tanken.model.HistoryResponse
import gg.felo.tanken.model.HistoryStats
import gg.felo.tanken.model.ManualScansResponse
import gg.felo.tanken.model.MeResponse
import gg.felo.tanken.model.PriceBandResponse
import gg.felo.tanken.model.PublicConfig
import gg.felo.tanken.model.ScanLocationsResponse
import gg.felo.tanken.model.Station
import gg.felo.tanken.model.StationDetail
import gg.felo.tanken.model.UserSettings
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertTrue

/**
 * Decodes recorded live responses (fixtures fetched from tanken.felo.gg).
 * Fixture loading is JVM-only; the JSON strings below are embedded excerpts
 * covering the structural essentials of every endpoint.
 */
class ModelsTest {
    private val json = Json { ignoreUnknownKeys = true; isLenient = true; explicitNulls = false }

    @Test
    fun decodesStation() {
        val text = """[{"id":"1482765d","lat":52.54,"lng":13.18,"dist":16.96,"name":"Freie Tankstelle","brand":"Freie Tankstelle","place":"Berlin","price":1.659,"isOpen":true,"street":"Zeppelinstr.","postCode":"13583","houseNumber":"51 a","distApprox":false}]"""
        val stations = json.decodeFromString<List<Station>>(text)
        assertTrue(stations.single().price == 1.659)
        assertTrue(stations.single().address == "Zeppelinstr. 51 a, Berlin")
    }

    @Test
    fun decodesStationDetail() {
        val text = """{"id":"x","name":"T","brand":"B","street":"S","houseNumber":"1","postCode":"13583","place":"Berlin","lat":52.5,"lng":13.4,"isOpen":true,"e5":1.799,"e10":1.799,"diesel":1.659,"openingTimes":[],"wholeDay":true}"""
        val d = json.decodeFromString<StationDetail>(text)
        assertTrue(d.wholeDay && d.diesel == 1.659)
    }

    @Test
    fun decodesPriceBand() {
        val text = """{"fuel":"diesel","band":{"p10":1.889,"p50":1.909,"p90":1.979,"samples":238},"radiusKm":100,"generatedAt":"2026-07-03T08:00:00.000Z"}"""
        val b = json.decodeFromString<PriceBandResponse>(text)
        assertTrue(b.band?.p10 == 1.889 && b.band?.samples == 238)
    }

    @Test
    fun decodesHistory() {
        val text = """{"entries":[{"timestamp":"2026-06-03T09:31:17.338Z","min_price":1.799,"avg_price":1.837,"max_price":1.909,"station":"BK","num_stations":56,"location_id":"loc-1"}],"extremes":{"cheapest":{"station_name":"KP","station_id":"a","station_brand":"bft","price":1.549,"timestamp":"2026-06-18T10:23:23.875Z"}}}"""
        val h = json.decodeFromString<HistoryResponse>(text)
        assertTrue(h.entries.single().minPrice == 1.799)
        assertTrue(h.extremes?.cheapest?.price == 1.549)
    }

    @Test
    fun decodesStats() {
        val text = """{"dayAvgs":[{"day":0,"name":"Sonntag","avg":1.82,"count":16335}],"hourAvgs":[{"hour":4,"avg":1.786,"count":723}],"stationRanking":[{"station":"Harry","avg":1.649,"min":1.649,"count":5,"id":"b39","brand":"Hoth"}],"overall":{"lowest_ever":1.549,"highest_ever":2.579,"avg":1.72,"entries":664,"since":"2026-06-03T09:31:17.338Z","until":"2026-07-03T03:28:36.127Z"}}"""
        val s = json.decodeFromString<HistoryStats>(text)
        assertTrue(s.overall?.lowestEver == 1.549 && s.hourAvgs.single().hour == 4)
    }

    @Test
    fun decodesConfigMeSettingsScansLocations() {
        val config = json.decodeFromString<PublicConfig>(
            """{"smtpConfigured":true,"fuel_type":"diesel","radius_km":25,"refresh_interval_minutes":90,"thresholds":{"good_below_avg_cents":3,"okay_below_avg_cents":1},"auth":{"provider":"oidc","oidcConfigured":true,"issuerUrl":"https://id.felo.gg","clientId":"c","oidcName":"Felo ID","browserLoginProvider":"felo-id","adminPanelPath":"/admin","sessionCookie":"tank_session","notes":{"oidc":null}}}""",
        )
        assertTrue(config.smtpConfigured && config.auth?.oidcName == "Felo ID")

        val me = json.decodeFromString<MeResponse>(
            """{"authenticated":false,"user":null,"auth":{"provider":"oidc","configured":true,"adminPanelPath":"/admin"}}""",
        )
        assertTrue(!me.authenticated && me.user == null)

        val settings = json.decodeFromString<UserSettings>(
            """{"fuelType":"diesel","radiusKm":25,"currentTab":"map","historyDefaultDays":7}""",
        )
        assertTrue(settings.historyDefaultDays == 7)

        val scans = json.decodeFromString<ManualScansResponse>("""{"ttlMs":3600000,"scans":[]}""")
        assertTrue(scans.ttlMs == 3_600_000L)

        val locations = json.decodeFromString<ScanLocationsResponse>(
            """{"locations":[{"id":"loc-1","name":"Mühldorf","country":"de","lat":48.24,"lng":12.52,"radiusKm":10}]}""",
        )
        assertTrue(locations.locations.single().name == "Mühldorf")

        val historyLocations = json.decodeFromString<HistoryLocationsResponse>(
            """{"locations":["loc-1","loc-2"]}""",
        )
        assertTrue(historyLocations.locations.size == 2)
    }
}
