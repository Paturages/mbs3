require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD
} = process.env;

const { Pool } = require('pg');
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT
});

const lines = `1	18207992	Zau1 345	-6	11040524	jman1205	-4	2	Week 1 Sat	20:00:00
1	18207992	Zau1 345	-6	8631719	Defectum	2	8	Week 1 Sun	17:00:00
1	18207992	Zau1 345	-6	14778697	[F o r e v e r]	9	9	Week 2 Sun	02:00:00
1	11040524	jman1205	-4	8631719	Defectum	2	6	Week 2 Sat	20:00:00
1	11040524	jman1205	-4	14778697	[F o r e v e r]	9	11	Week 1 Sat	01:00:00
1	8631719	Defectum	2	14778697	[F o r e v e r]	9	7	Week 2 Sat	08:00:00
2	5765923	CloudBeater	2	8720555	StartAndSelect	1	1	Week 1 Sun	13:00:00
2	5765923	CloudBeater	2	10409963	LieTieOsu	3	1	Week 1 Sat	11:00:00
2	5765923	CloudBeater	2	14856326	Terfight	2	0	Week 2 Sat	13:00:00
2	8720555	StartAndSelect	1	10409963	LieTieOsu	3	2	Week 2 Sun	10:00:00
2	8720555	StartAndSelect	1	14856326	Terfight	2	1	Week 1 Sat	12:00:00
2	10409963	LieTieOsu	3	14856326	Terfight	2	1	Week 1 Sun	08:00:00
3	17174691	Adracon	-3	8945180	molneya	8	11	Week 2 Sun	13:00:00
3	17174691	Adracon	-3	3617111	PokeSky	8	11	Week 2 Sat	13:00:00
3	17174691	Adracon	-3	10116288	oussfahd	2	5	Week 1 Sun	13:00:00
3	8945180	molneya	8	3617111	PokeSky	8	0	Week 1 Sun	04:00:00
3	8945180	molneya	8	10116288	oussfahd	2	6	Week 2 Sun	09:00:00
3	3617111	PokeSky	8	10116288	oussfahd	2	6	Week 1 Sat	09:00:00
4	3867109	Maou	2	17538478	[RUE]Chat_Pitre	2	0	Week 1 Sat	08:00:00
4	3867109	Maou	2	6318977	svc3255	-5	7	Week 2 Sun	20:00:00
4	3867109	Maou	2	2307285	IControl	-4	6	Week 2 Sat	14:00:00
4	17538478	[RUE]Chat_Pitre	2	6318977	svc3255	-5	7	Week 1 Sun	20:00:00
4	17538478	[RUE]Chat_Pitre	2	2307285	IControl	-4	6	Week 2 Sun	17:00:00
4	6318977	svc3255	-5	2307285	IControl	-4	1	Week 1 Sat	23:00:00
5	7957385	Weptisop	-5	17854100	Sizz	2	7	Week 1 Sat	16:00:00
5	7957385	Weptisop	-5	15409748	vortexx	10	9	Week 1 Sun	01:00:00
5	7957385	Weptisop	-5	4026124	Infinitstart	7	12	Week 2 Sun	15:00:00
5	17854100	Sizz	2	15409748	vortexx	10	8	Week 2 Sun	09:00:00
5	17854100	Sizz	2	4026124	Infinitstart	7	5	Week 2 Sat	08:00:00
5	15409748	vortexx	10	4026124	Infinitstart	7	3	Week 1 Sat	06:00:00
6	11404841	Mokip	2	6752242	ZelLink	-3	5	Week 1 Sat	14:00:00
6	11404841	Mokip	2	17823683	ArnaldoCasanova	-5	7	Week 1 Sun	17:00:00
6	11404841	Mokip	2	8184715	Syako	-4	6	Week 2 Sun	20:00:00
6	6752242	ZelLink	-3	17823683	ArnaldoCasanova	-5	2	Week 2 Sun	22:00:00
6	6752242	ZelLink	-3	8184715	Syako	-4	1	Week 2 Sat	21:00:00
6	17823683	ArnaldoCasanova	-5	8184715	Syako	-4	1	Week 1 Sun	22:00:00
7	18423393	RaffawWl	-3	8694649	DrugManager	2	5	Week 1 Sat	16:00:00
7	18423393	RaffawWl	-3	13443798	xmallax	2	5	Week 1 Sun	17:00:00
7	18423393	RaffawWl	-3	7789926	bvyans	-4	1	Week 2 Sun	22:00:00
7	8694649	DrugManager	2	13443798	xmallax	2	0	Week 2 Sat	18:00:00
7	8694649	DrugManager	2	7789926	bvyans	-4	6	Week 2 Sun	14:00:00
7	13443798	xmallax	2	7789926	bvyans	-4	6	Week 1 Sat	18:00:00
8	16088215	xBlayd	-5	10883287	-YUUKINA-	7	12	Week 1 Sat	03:00:00
8	16088215	xBlayd	-5	15659637	Krasy_	-4	1	Week 2 Sat	20:00:00
8	16088215	xBlayd	-5	13650129	[MATHIS]	2	7	Week 2 Sun	16:00:00
8	10883287	-YUUKINA-	7	15659637	Krasy_	-4	11	Week 1 Sun	15:00:00
8	10883287	-YUUKINA-	7	13650129	[MATHIS]	2	5	Week 2 Sat	10:00:00
8	15659637	Krasy_	-4	13650129	[MATHIS]	2	6	Week 1 Sat	15:00:00
9	4588239	Aizeia	2	5028866	ibacot	7	5	Week 1 Sat	09:00:00
9	4588239	Aizeia	2	12643659	Darnagon	-4	6	Week 2 Sat	15:00:00
9	4588239	Aizeia	2	14927231	TheTechKidYT	8	6	Week 2 Sun	08:00:00
9	5028866	ibacot	7	12643659	Darnagon	-4	11	Week 1 Sun	14:00:00
9	5028866	ibacot	7	14927231	TheTechKidYT	8	1	Week 2 Sat	03:00:00
9	12643659	Darnagon	-4	14927231	TheTechKidYT	8	12	Week 1 Sat	14:00:00
10	6186473	Parax_UnDeath	2	2931858	Nuketea	-7	9	Week 1 Sat	17:00:00
10	6186473	Parax_UnDeath	2	20037405	[ Raiid ]	7	5	Week 2 Sat	09:00:00
10	6186473	Parax_UnDeath	2	513834	Katsumi	2	0	Week 2 Sun	13:00:00
10	2931858	Nuketea	-7	20037405	[ Raiid ]	7	10	Week 1 Sat	04:00:00
10	2931858	Nuketea	-7	513834	Katsumi	2	9	Week 2 Sun	18:00:00
10	20037405	[ Raiid ]	7	513834	Katsumi	2	5	Week 1 Sun	11:00:00
11	11263916	qej	-4	5305349	jaegereren0928	8	12	Week 1 Sat	14:00:00
11	11263916	qej	-4	20020441	cygerion	-5	1	Week 2 Sat	21:00:00
11	11263916	qej	-4	13661408	Ventilo le vrai	2	6	Week 2 Sun	20:00:00
11	5305349	jaegereren0928	8	20020441	cygerion	-5	11	Week 1 Sun	02:00:00
11	5305349	jaegereren0928	8	13661408	Ventilo le vrai	2	6	Week 2 Sat	12:00:00
11	20020441	cygerion	-5	13661408	Ventilo le vrai	2	7	Week 1 Sat	19:00:00
12	17889002	Pice	-5	14973453	peteploy123	7	12	Week 1 Sat	15:00:00
12	17889002	Pice	-5	8182717	Espurr	7	12	Week 2 Sat	15:00:00
12	17889002	Pice	-5	12312838	reallemonmaster	0	5	Week 2 Sun	18:00:00
12	14973453	peteploy123	7	8182717	Espurr	7	0	Week 1 Sun	07:00:00
12	14973453	peteploy123	7	12312838	reallemonmaster	0	7	Week 2 Sat	11:00:00
12	8182717	Espurr	7	12312838	reallemonmaster	0	7	Week 2 Sun	12:00:00
13	13806979	Wakeboard777	-4	12563193	Zulsramno	2	6	Week 1 Sat	15:00:00
13	13806979	Wakeboard777	-4	17989444	-Xuste-	-5	1	Week 2 Sat	23:00:00
13	13806979	Wakeboard777	-4	9489153	QEpicAce	2	6	Week 2 Sun	14:00:00
13	12563193	Zulsramno	2	17989444	-Xuste-	-5	7	Week 1 Sun	19:00:00
13	12563193	Zulsramno	2	9489153	QEpicAce	2	0	Week 2 Sun	11:00:00
13	17989444	-Xuste-	-5	9489153	QEpicAce	2	7	Week 1 Sat	16:00:00
14	8250678	Fl0oW	2	9506428	semloh	-5	7	Week 1 Sat	17:00:00
14	8250678	Fl0oW	2	19177783	Tiago_LLFD	-3	5	Week 2 Sat	19:00:00
14	8250678	Fl0oW	2	3600549	arth	-4	6	Week 2 Sun	14:00:00
14	9506428	semloh	-5	19177783	Tiago_LLFD	-3	2	Week 1 Sun	22:00:00
14	9506428	semloh	-5	3600549	arth	-4	1	Week 2 Sat	23:00:00
14	19177783	Tiago_LLFD	-3	3600549	arth	-4	1	Week 1 Sat	20:00:00
15	8134650	UnitedWeGhost	-5	16198858	NikanzuGZ	7	12	Week 1 Sat	03:00:00
15	8134650	UnitedWeGhost	-5	7246165	Kageno	8	11	Week 2 Sat	02:00:00
15	8134650	UnitedWeGhost	-5	11354950	mickeyparm	7	12	Week 2 Sun	15:00:00
15	16198858	NikanzuGZ	7	7246165	Kageno	8	1	Week 1 Sun	06:00:00
15	16198858	NikanzuGZ	7	11354950	mickeyparm	7	0	Week 2 Sat	04:00:00
15	7246165	Kageno	8	11354950	mickeyparm	7	1	Week 1 Sat	05:00:00
16	5472693	Agent5d	2	11216472	Panda_0ne	2	0	Week 1 Sat	08:00:00
16	5472693	Agent5d	2	10211875	Naikyo	10	8	Week 2 Sun	08:00:00
16	5472693	Agent5d	2	9041586	Nyroxx_	2	0	Week 2 Sat	11:00:00
16	11216472	Panda_0ne	2	10211875	Naikyo	10	8	Week 1 Sun	09:00:00
16	11216472	Panda_0ne	2	9041586	Nyroxx_	2	0	Week 2 Sat	16:00:00
16	10211875	Naikyo	10	9041586	Nyroxx_	2	8	Week 1 Sat	10:00:00
17	17906556	TheeGerman	-7	13378002	Sinsa92	2	9	Week 2 Sat	17:00:00
17	17906556	TheeGerman	-7	4937439	GrilledCheeese	2	9	Week 2 Sun	18:00:00
17	17906556	TheeGerman	-7	15922698	Kabo_boi	-7	0	Week 1 Sat	02:00:00
17	13378002	Sinsa92	2	4937439	GrilledCheeese	2	0	Week 1 Sun	16:00:00
17	13378002	Sinsa92	2	15922698	Kabo_boi	-7	9	Week 2 Sun	19:00:00
17	4937439	GrilledCheeese	2	15922698	Kabo_boi	-7	9	Week 1 Sun	18:00:00
18	4258883	vipera767	2	4183406	Sladak	-5	7	Week 2 Sun	16:00:00
18	4258883	vipera767	2	3187959	iSparkyF	-5	7	Week 1 Sun	16:00:00
18	4258883	vipera767	2	10473045	No0b	7	5	Week 2 Sun	10:00:00
18	4183406	Sladak	-5	3187959	iSparkyF	-5	0	Week 1 Sun	00:00:00
18	4183406	Sladak	-5	10473045	No0b	7	12	Week 1 Sun	03:00:00
18	3187959	iSparkyF	-5	10473045	No0b	7	12	Week 2 Sun	15:00:00
19	8379046	AmateurMonkeyYT	10	14559339	MCJze	8	2	Week 1 Sat	07:00:00
19	8379046	AmateurMonkeyYT	10	10062281	NathanGt	-4	10	Week 2 Sat	01:00:00
19	8379046	AmateurMonkeyYT	10	18423554	breadwithbutter	-4	10	Week 2 Sun	02:00:00
19	14559339	MCJze	8	10062281	NathanGt	-4	12	Week 1 Sun	02:00:00
19	14559339	MCJze	8	18423554	breadwithbutter	-4	12	Week 2 Sat	14:00:00
19	10062281	NathanGt	-4	18423554	breadwithbutter	-4	0	Week 1 Sat	22:00:00
20	17651938	cuber1020	-4	16717193	MrJ23o	-5	1	Week 1 Sat	21:00:00
20	17651938	cuber1020	-4	10399917	uNearly	-4	0	Week 2 Sat	22:00:00
20	17651938	cuber1020	-4	17918347	Sr BRENNO	-3	1	Week 2 Sun	23:00:00
20	16717193	MrJ23o	-5	10399917	uNearly	-4	1	Week 1 Sun	21:00:00
20	16717193	MrJ23o	-5	17918347	Sr BRENNO	-3	2	Week 2 Sat	22:00:00
20	10399917	uNearly	-4	17918347	Sr BRENNO	-3	1	Week 1 Sat	23:00:00
21	2570828	Megatron is bad	-7	9908055	Ihram-San	7	10	Week 1 Sat	04:00:00
21	2570828	Megatron is bad	-7	16404881	Gwens	2	9	Week 2 Sat	18:00:00
21	2570828	Megatron is bad	-7	16379858	Diamond Lily	2	9	Week 2 Sun	19:00:00
21	9908055	Ihram-San	7	16404881	Gwens	2	5	Week 1 Sun	09:00:00
21	9908055	Ihram-San	7	16379858	Diamond Lily	2	5	Week 2 Sat	11:00:00
21	16404881	Gwens	2	16379858	Diamond Lily	2	0	Week 1 Sat	19:00:00
22	10167542	vernonlim	8	9188198	daveyard	0	8	Week 1 Sun	12:00:00
22	10167542	vernonlim	8	13017818	twistedyoyo20	-5	11	Week 2 Sat	02:00:00
22	10167542	vernonlim	8	9351030	Haryume	8	0	Week 2 Sun	05:00:00
22	9188198	daveyard	0	13017818	twistedyoyo20	-5	5	Week 1 Sat	18:00:00
22	9188198	daveyard	0	9351030	Haryume	8	8	Week 2 Sat	10:00:00
22	13017818	twistedyoyo20	-5	9351030	Haryume	8	11	Week 1 Sat	02:00:00
23	16281696	seb1426	-5	14729666	HachaOso	-3	2	Week 1 Sat	21:00:00
23	16281696	seb1426	-5	2222301	DrawnGirl	2	7	Week 1 Sun	19:00:00
23	16281696	seb1426	-5	251683	Musty	2	7	Week 2 Sun	17:00:00
23	14729666	HachaOso	-3	2222301	DrawnGirl	2	5	Week 2 Sun	19:00:00
23	14729666	HachaOso	-3	251683	Musty	2	5	Week 1 Sun	19:00:00
23	2222301	DrawnGirl	2	251683	Musty	2	0	Week 2 Sat	16:00:00
24	12677757	ProstoOK	3	17195504	Yayamon	2	1	Week 1 Sat	11:00:00
24	12677757	ProstoOK	3	16214723	Qutilt	7	4	Week 2 Sat	07:00:00
24	12677757	ProstoOK	3	10069850	Normiplier	8	5	Week 2 Sun	07:00:00
24	17195504	Yayamon	2	16214723	Qutilt	7	5	Week 1 Sun	11:00:00
24	17195504	Yayamon	2	10069850	Normiplier	8	6	Week 2 Sat	09:00:00
24	16214723	Qutilt	7	10069850	Normiplier	8	1	Week 1 Sun	05:00:00
25	13392709	Emre1504	2	19506369	-Ena-	1	1	Week 1 Sat	19:00:00
25	13392709	Emre1504	2	10417994	Mikan080	-4	6	Week 2 Sat	19:00:00
25	13392709	Emre1504	2	9709652	junglesnipes	-4	6	Week 2 Sun	17:00:00
25	19506369	-Ena-	1	10417994	Mikan080	-4	5	Week 1 Sun	18:00:00
25	19506369	-Ena-	1	9709652	junglesnipes	-4	5	Week 2 Sat	20:00:00
25	10417994	Mikan080	-4	9709652	junglesnipes	-4	0	Week 1 Sat	00:00:00
26	6051693	Wolferal	-7	12503371	Charleyccc	-4	3	Week 1 Sat	00:00:00
26	6051693	Wolferal	-7	12083116	Render_1	1	8	Week 1 Sun	20:00:00
26	6051693	Wolferal	-7	18834550	RhymesWithMash	-4	3	Week 2 Sun	01:00:00
26	12503371	Charleyccc	-4	12083116	Render_1	1	5	Week 2 Sun	21:00:00
26	12503371	Charleyccc	-4	18834550	RhymesWithMash	-4	0	Week 1 Sun	00:00:00
26	12083116	Render_1	1	18834550	RhymesWithMash	-4	5	Week 2 Sat	17:00:00
27	9536977	Ethaaaan	-5	13101668	p0kiii	2	7	Week 1 Sat	18:00:00
27	9536977	Ethaaaan	-5	16479936	marcel24	-4	1	Week 2 Sat	00:00:00
27	9536977	Ethaaaan	-5	11694276	playCAP	1	6	Week 2 Sun	21:00:00
27	13101668	p0kiii	2	16479936	marcel24	-4	6	Week 1 Sun	14:00:00
27	13101668	p0kiii	2	11694276	playCAP	1	1	Week 2 Sat	13:00:00
27	16479936	marcel24	-4	11694276	playCAP	1	5	Week 1 Sat	20:00:00
28	11818585	Baguette2Pain	2	13145344	dylan52528	-4	6	Week 1 Sat	17:00:00
28	11818585	Baguette2Pain	2	10981171	kit-	11	9	Week 2 Sat	08:00:00
28	11818585	Baguette2Pain	2	14486251	Franco_8890	-4	6	Week 2 Sun	16:00:00
28	13145344	dylan52528	-4	10981171	kit-	11	9	Week 1 Sun	01:00:00
28	13145344	dylan52528	-4	14486251	Franco_8890	-4	0	Week 2 Sat	23:00:00
28	10981171	kit-	11	14486251	Franco_8890	-4	9	Week 1 Sat	01:00:00
29	9671048	- PLARHELLME -	7	18175073	Kouhei79	3	4	Week 1 Sun	10:00:00
29	9671048	- PLARHELLME -	7	10780764	MPWercix	2	5	Week 2 Sat	12:00:00
29	9671048	- PLARHELLME -	7	3765760	Krokieet	2	5	Week 2 Sun	12:00:00
29	18175073	Kouhei79	3	10780764	MPWercix	2	1	Week 2 Sun	10:00:00
29	18175073	Kouhei79	3	3765760	Krokieet	2	1	Week 1 Sat	12:00:00
29	10780764	MPWercix	2	3765760	Krokieet	2	0	Week 1 Sun	12:00:00
30	14762867	kellyalessa	-3	9088283	Stak0s	-4	1	Week 1 Sat	22:00:00
30	14762867	kellyalessa	-3	6180024	ph03n1x	-5	2	Week 2 Sat	21:00:00
30	14762867	kellyalessa	-3	10262909	daput	7	10	Week 2 Sun	13:00:00
30	9088283	Stak0s	-4	6180024	ph03n1x	-5	1	Week 1 Sun	20:00:00
30	9088283	Stak0s	-4	10262909	daput	7	11	Week 2 Sat	14:00:00
30	6180024	ph03n1x	-5	10262909	daput	7	12	Week 1 Sun	03:00:00
31	11842432	iHydrogenXHD	1	10184326	samlogo10	-5	6	Week 1 Sun	16:00:00
31	11842432	iHydrogenXHD	1	9535497	Gatto Nero	7	6	Week 2 Sat	10:00:00
31	11842432	iHydrogenXHD	1	11358695	Noasz	-3	4	Week 2 Sun	21:00:00
31	10184326	samlogo10	-5	9535497	Gatto Nero	7	12	Week 2 Sun	03:00:00
31	10184326	samlogo10	-5	11358695	Noasz	-3	2	Week 1 Sun	21:00:00
31	9535497	Gatto Nero	7	11358695	Noasz	-3	10	Week 1 Sat	13:00:00
32	4631315	Hitorion	2	11548612	Brokulek_OwO	2	0	Week 1 Sat	13:00:00
32	4631315	Hitorion	2	16748982	PEDROX_BR	-3	5	Week 2 Sat	17:00:00
32	4631315	Hitorion	2	18188796	eubcwidcubwi	8	6	Week 2 Sun	11:00:00
32	11548612	Brokulek_OwO	2	16748982	PEDROX_BR	-3	5	Week 1 Sun	15:00:00
32	11548612	Brokulek_OwO	2	18188796	eubcwidcubwi	8	6	Week 2 Sat	09:00:00
32	16748982	PEDROX_BR	-3	18188796	eubcwidcubwi	8	11	Week 1 Sat	13:00:00`.split('\n');

(async () => {
	for (const line of lines) {
		const [group, p1Id, p1Username, p1tz, p2Id, p2Username, p2tz, tzdiff, day, time] = line.split('\t');
		const date = {
			'Week 1 Sat': '2021-05-01',
			'Week 1 Sun': '2021-05-02',
			'Week 2 Sat': '2021-05-08',
			'Week 2 Sun': '2021-05-09',
		}[day];
		const { rows: [match] } = await pool.query(`insert into matches (time, stage) values ($1, $2) returning id`, [
			`${date}T${time.slice(0, 5)}Z`,
			'groups'
		]);
		await pool.query(`insert into matches_players (matches_id, players_id) values ($1, $2), ($1, $3)`, [
			match.id,
			p1Id,
			p2Id
		]);
		console.log('Group', group, p1Username, 'vs.', p2Username, `${date}T${time.slice(0, 5)}Z`);
	}
})();

