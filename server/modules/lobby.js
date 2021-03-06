var ClientsByNickname = {}
var NicknamesByClientId = {}
var StatusByNickname = {}
var PendingInvitations = {}

module.exports = { //Lobby
    acceptClient: function (client, nickname) {
        if (ClientsByNickname[nickname] || NicknamesByClientId[client.id]) {
            console.log("ERROR: Klient już jest w lobby a próbuje dołączyć")
            return false
        }
        ClientsByNickname[nickname] = client
        NicknamesByClientId[client.id] = nickname
        StatusByNickname[nickname] = "available"
        return true
    },

    clientLeft: function (client) {
        if (NicknamesByClientId[client.id]) {
            let nickname = NicknamesByClientId[client.id]
            if (ClientsByNickname[nickname]) {
                ClientsByNickname[nickname] = null
                delete ClientsByNickname[nickname]
            }
            if (StatusByNickname[nickname]) {
                StatusByNickname[nickname] = null
                delete StatusByNickname[nickname]
            }
            NicknamesByClientId[client.id] = null
            delete NicknamesByClientId[client.id]
        }
    },

    getClients: function () {
        let clients = []
        for (let prop in ClientsByNickname) { if (ClientsByNickname.hasOwnProperty(prop)) clients.push(ClientsByNickname[prop]) }
        return clients
    },

    getNicknames: function () {
        let nicknames = []
        for (let prop in NicknamesByClientId) { if (NicknamesByClientId.hasOwnProperty(prop)) nicknames.push(NicknamesByClientId[prop]) }
        return nicknames
    },

    getClientByNickname: function (nickname) {
        return ClientsByNickname[nickname]
    },

    getNicknameByClient: function (client) {
        return NicknamesByClientId[client.id]
    },

    getStatusByNickname: function (nickname) {
        return StatusByNickname[nickname]
    },

    getStatusByClient: function (client) {
        if (this.getNicknameByClient(client)) return StatusByNickname[this.getNicknameByClient(client)]
        return null
    },

    getPlayerInfo: function () {
        let nicknames = this.getNicknames()
        let info = []
        for (let n of nicknames) info.push({ nickname: n, status: this.getStatusByNickname(n) })
        return info
    },

    setPlayerStatusByNickname: function (nickname, status) {
        if (ClientsByNickname[nickname]) StatusByNickname[nickname] = status
    },

    setPlayerStatusByClient: function (client, status) {
        if (NicknamesByClientId[client.id]) StatusByNickname[this.getNicknameByClient(client)] = status
    },

    getInvitations: function () {
        let invitations = []
        for (let prop in PendingInvitations) { if (PendingInvitations.hasOwnProperty(prop)) invitations.push({ from: prop, to: PendingInvitations[prop] }) }
        return invitations
    },

    addInvitation: function (from, to) {
        if (PendingInvitations[from])
            console.log("ERROR: Can't invite multiple people at once. ", from, to)
        else
            PendingInvitations[from] = to
    },

    removeInvitationFrom: function (from) {
        if (PendingInvitations[from]) {
            PendingInvitations[from] = null
            delete PendingInvitations[from]
        }
    },

    getInvitationFrom: function (from) {
        return PendingInvitations[from]
    },

    getInvitationsTo: function (to) {
        let invitations = []
        for (let prop in PendingInvitations) {
            if (PendingInvitations.hasOwnProperty(prop) && PendingInvitations[prop] == to) {
                invitations.push({
                    from: prop, to: to
                })
            }
        }
        return invitations
    }
}