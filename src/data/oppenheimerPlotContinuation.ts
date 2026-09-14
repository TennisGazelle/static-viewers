import type { BranchUserApi, GitgraphUserApi } from '@gitgraph/core'
import type { ReactElement } from 'react'

type PlotGitgraph = GitgraphUserApi<ReactElement<SVGElement>>
type PlotBranch = BranchUserApi<ReactElement<SVGElement>>

const COLOR = {
  losAlamos: '#efb366',
  postwar: '#d98b45',
  hearing: '#e8913a',
  senate: '#7a8ba8',
  straussPast: '#93a4bf',
} as const

function branchWithColor(
  parent: PlotGitgraph | PlotBranch,
  name: string,
  color: string,
): PlotBranch {
  return parent.branch({
    name,
    style: { color },
    commitDefaultOptions: {
      style: {
        color,
        message: { color },
        dot: { color },
      },
    },
  })
}

export function appendOppenheimerPlot(
  fission: PlotBranch,
  fusion: PlotBranch,
  berkeley: PlotBranch,
) {
  berkeley.commit('Political orbit widens: union causes, Spanish relief, Jean Tatlock and Communist friends')
  berkeley.commit('Party gathering: meets Kitty; New Mexico ride; Kitty recounts Joe Dallet and her break with the Party')
  berkeley.commit('Frank and Jackie are Party members; Oppie refuses membership but keeps the associations')
  berkeley.commit('News of fission: Hahn splits uranium; Lawrence, Tolman and Oppie grasp the military implications')
  berkeley.commit('Einstein letter / Uranium Committee context; war closes in and the bomb race becomes real')
  berkeley.commit('Jean relationship fractures; Oppie marries Kitty; Peter is born')
  berkeley.commit('Chevalier takes Peter briefly when Oppie and Kitty buckle under parenthood')
  berkeley.commit('Kitty pushes Oppie to lead rather than merely advise the bomb effort')
  berkeley.commit('Groves interviews Oppie: Germany has Heisenberg; scattered American labs need one director')
  berkeley.commit('Oppie pitches a central secret laboratory where every discipline can see the whole problem')
  fission.merge(berkeley)

  const losAlamos = branchWithColor(fission, 'fission-los-alamos', COLOR.losAlamos)
  losAlamos
    .commit('Groves approves Los Alamos: school, families, fences, desert and one impossible deadline')
    .tag('colour, New Mexico / Manhattan Project, 1942-45')
  losAlamos.commit('Recruiting tour: Bainbridge, Donald, Condon, Feynman, Bethe and others are pulled into the project')
  losAlamos.commit('Rabi refuses to join full-time, warns what the bomb means, and tells Oppie to be himself')
  losAlamos.commit('Oppie sheds the uniform, adopts hat and pipe; the iconic Los Alamos director emerges')
  losAlamos.commit('Berkeley theory group meets; Teller raises the possibility of igniting the atmosphere')
  losAlamos.commit('Oppie takes Teller calculations to Einstein; chain reaction risk cannot simply be waved away')
  losAlamos.commit('Met Lab visit: Fermi and Szilard have already achieved a self-sustaining chain reaction')
  losAlamos.commit('Condon quits over compartmentalization; Groves finally forces Oppie security clearance through')

  fission.commit('1954 hearing: Groves says security officers resisted clearing Oppie, but he trusted him at Los Alamos')

  losAlamos.commit('Los Alamos grows into a town; British contingent arrives, including Klaus Fuchs')
  losAlamos.commit('Gun-type versus implosion designs split the work; plutonium makes implosion essential')
  losAlamos.commit('Teller pursues the Super; Oppie keeps him at Los Alamos with a weekly hour for fusion research')
  losAlamos.commit('Jean summons Oppie to San Francisco; surveillance follows him to their final night together')

  fission.commit('1954 hearing exposes the Tatlock affair in front of Kitty; Oppie says he never saw Jean again')
  fission.commit('Kitty leaves furious that private grief has been converted into permanent testimony')

  losAlamos.commit('Chevalier incident: Eltenton offers a Soviet channel; Oppie rejects it but later invents a three-person story')
  losAlamos.commit('Pash interrogates Oppie; he refuses the intermediary name and tries to protect Chevalier')
  losAlamos.commit('Groves warns the false story may haunt him; months later Oppie finally names Chevalier')

  fission.commit('1954 hearing: Pash details the resources wasted chasing Oppie fabricated account')

  losAlamos.commit('Christmas party: Tolman returns with intelligence that German bomb work is far behind')
  losAlamos.commit('Relief curdles into urgency: if Germany is no longer the target, what exactly is the weapon for?')
  losAlamos.commit('Implosion program stalls; Kistiakowsky replaces Neddermeyer, Fuchs takes Teller calculations')
  losAlamos.commit('Germany collapses; scientists debate whether using the bomb can still be justified')
  losAlamos.commit('Oppie argues only use will make the world understand the weapon and force international control')
  losAlamos.commit('Successful implosion work yields two viable bomb designs; Groves demands a July test')
  losAlamos.commit('Frank joins the project; Oppie names the desert test Trinity')
  losAlamos.commit('Target committee and military planning move the weapon from physics into operational war')
  losAlamos.commit('Szilard petition and scientific dissent grow; Oppie carries views upward but does not endorse stopping use')
  losAlamos.commit('Trinity preparations: tower, observation posts, blast-radius planning and evacuation contingencies')
  losAlamos.commit('Final implosion test disappoints; storm threatens the schedule; Kistiakowsky bets the device will work')
  losAlamos.commit('Countdown disperses scientists across bunkers, base camp and distant observation points')
  losAlamos.commit('Trinity: silent white light, fireball, shock wave; "destroyer of worlds"')
  losAlamos.commit('Celebration breaks out; Oppie sends Kitty the coded message: bring in the sheets')
  losAlamos.commit('Bomb components leave Los Alamos; Teller asks what right the scientists have to decide their use')
  losAlamos.commit('Hiroshima announced over radio; Groves congratulates Oppie while Los Alamos celebrates uneasily')
  losAlamos.commit('Fuller Lodge speech: triumph turns hallucinatory as Oppie imagines burned bodies and stamping feet')
  losAlamos.commit('Nagasaki and surrender follow; the weapon has escaped the laboratory into history')

  fission.merge(losAlamos)

  const postwar = branchWithColor(fission, 'fission-postwar', COLOR.postwar)
  postwar
    .commit('Meets Truman: Oppie says he feels blood on his hands; Truman dismisses him as a crybaby')
    .tag('colour, postwar policy / AEC, 1945-54')
  postwar.commit('Oppie becomes public "father of the bomb" and the country leading atomic-policy voice')
  postwar.commit('AEC / GAC work: isotope export fight humiliates Strauss before Congress')
  postwar.commit('Soviet atomic test shocks the AEC; the Super / hydrogen-bomb debate becomes unavoidable')
  postwar.commit('Rabi and Oppie oppose a crash H-bomb program as genocidal escalation; Strauss argues deterrence')
  postwar.commit('Truman orders the H-bomb program anyway; the arms race Oppie feared accelerates')
  postwar.commit('Strauss birthday: news breaks that Klaus Fuchs spied for the Soviets throughout Los Alamos')
  postwar.commit('Surveillance tightens around Oppie; fame no longer protects his associations or policy dissent')
  postwar.commit('Oppie public lecture urges candor about the nuclear arms race; Washington sees him as obstructionist')
  postwar.commit('Borden studies Oppie file and sends Hoover his claim that Oppie is probably a Soviet agent')
  postwar.commit('Strauss and Nichols shape a closed security process: classified prosecution file, no normal burden of proof')
  postwar.commit('Nichols letter confronts Oppie with charges; Strauss advises him to walk away quietly')
  postwar.commit('Kitty refuses surrender; Volpe calls Lloyd Garrison and warns the hearing will not be fair')

  fission.merge(postwar)

  fission.commit('Robb reveals the 1943 Pash interview was recorded; defense still cannot access the classified evidence')
  fission.commit('Oppie admits the Chevalier tale was a cock-and-bull story and calls himself an idiot for inventing it')
  fission.commit('Rabi testifies for Oppie: why pillory a man who has already served the country so much?')

  fusion.commit('Strauss 1959 defense pivots: Time cover, scientists hostility, and suspicion that Borden held his knife')
  const straussPast = branchWithColor(fusion, 'fusion-strauss-aec', COLOR.straussPast)
  straussPast.commit('Strauss remembers isotope-export hearing: Oppie joke turns Congress against Strauss position')
  straussPast.commit('Strauss frames postwar disputes as Oppie using prestige to dominate policy')
  fusion.merge(straussPast)

  fission.commit('Borden letter is read into record: "more probably than not" Oppie was a Soviet agent')
  fission.commit('Vannevar Bush attacks the proceeding as a political pillory for unpopular scientific opinions')

  fusion.commit('David Hill unexpectedly testifies that Strauss used security machinery out of personal vindictiveness')
  fusion.commit('Hill links isotope humiliation, H-bomb policy and the Oppenheimer case into a Strauss pattern')

  fission.commit('Groves supports Oppie loyalty but says the later Atomic Energy Act standard might not clear him today')
  fission.commit('Kitty testifies and turns Robb questions back on him: old Party ties do not make Robert a Communist')
  fission.commit('Teller calls Oppie loyal but says national interests should be in hands he understands and trusts more')
  fission.commit('Oppie shakes Teller hand; Kitty tells him to stop playing the martyr')
  fission.commit('Einstein tells Oppie America is a woman who no longer loves him; perhaps he should turn his back')

  fusion.commit('Senate aide finally sees the mechanism: Strauss had access, motive and intermediaries but kept fingerprints off it')
  fusion.commit('Strauss insists Oppie wanted glory without responsibility and engineered his own martyrdom')

  fission.commit('Robb forces the moral contradiction: build Hiroshima bomb, then oppose thermonuclear escalation')
  fission.commit('Oppie separates wartime laboratory duty from postwar policy advice; arms race logic becomes his defense')
  fission.commit('Gray Board finds him loyal but votes 2-1 to deny renewal of his security clearance')
  fission.commit('Oppie calls Kitty with the inverted Trinity code: "do not take in the sheets"')

  fusion.commit('Strauss cabinet nomination fails; Senate holdouts include the young John F. Kennedy')
  fusion.commit('Aide suggests Einstein may never have been talking about Strauss at all')

  fission.commit('Kitty: humiliation will not make the world forgive him; Oppie can only answer, "we will see"')
  fission.commit('Years later the government gives Oppie a medal; public rehabilitation is for them, not for him')
  fission.commit('Return to Einstein pond: the old atmosphere calculation was about a chain reaction destroying the world')
  fission.commit('Oppie: "I believe we did"; visions of expanding arsenals consume the horizon')
}
